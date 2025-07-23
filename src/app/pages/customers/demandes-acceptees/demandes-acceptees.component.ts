/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 13/05/2025 - 05:35:16
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 13/05/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SoumissionDto } from '../../../components/demande-certificat/model/demande';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';
import { CdkStepperModule } from '@angular/cdk/stepper';

// Interface pour les totaux par type
interface TotalParType {
  typeDemande: string;
  nombre: number;
}

@Component({
  selector: 'app-demandes-acceptees',
  templateUrl: './demandes-acceptees.component.html',
  styleUrls: ['./demandes-acceptees.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxPaginationModule, CdkStepperModule]
})

export class DemandesAccepteesComponent implements OnInit {
  demandesAcceptees: SoumissionDto[] = [];
  filteredDemandes: SoumissionDto[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  searchTerm = '';
  motifRejet = '';

  // Totaux par type de demande - TOUJOURS basés sur toutes les demandes acceptées
  totalParType: TotalParType[] = [];
  totalGeneral = 0;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private demandeService: DemandeServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDemandesAcceptees();
  }

  loadDemandesAcceptees(): void {
    this.loading = true;
    this.error = false;

    this.demandeService.getDemandeAccepte().subscribe({
      next: (demandes) => {
        this.demandesAcceptees = demandes;
        this.filteredDemandes = [...demandes];
        this.totalItems = demandes.length;
        // Calculer les totaux UNE SEULE FOIS sur toutes les demandes
        this.calculerTotauxParType();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes acceptées', err);
        this.error = true;
        this.errorMessage = 'Impossible de charger les demandes acceptées. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  calculerTotauxParType(): void {
    // IMPORTANT: Toujours calculer sur demandesAcceptees (toutes les données)
    // et NON sur filteredDemandes
    const compteurs = new Map<string, number>();

    this.demandesAcceptees.forEach(demande => {
      const typeDemande = demande.typeDemande || 'Non spécifié';
      compteurs.set(typeDemande, (compteurs.get(typeDemande) || 0) + 1);
    });

    // Convertir le Map en tableau et trier par nombre décroissant
    this.totalParType = Array.from(compteurs.entries())
      .map(([typeDemande, nombre]) => ({ typeDemande, nombre }))
      .sort((a, b) => b.nombre - a.nombre);

    // Calculer le total général sur TOUTES les demandes acceptées
    this.totalGeneral = this.demandesAcceptees.length;
  }

  filterDemandes(): void {
    const code = this.searchTerm.trim();

    if (!code) {
      // Si pas de recherche, afficher toutes les demandes
      this.filteredDemandes = [...this.demandesAcceptees];
      this.totalItems = this.demandesAcceptees.length;
      this.currentPage = 1;
      this.error = false;
      this.errorMessage = '';
      // NE PAS recalculer les totaux - ils restent constants
      return;
    }

    this.loading = true;
    this.error = false;

    this.demandeService.getDemandeByCodeDemande(code).subscribe({
      next: (demande) => {
        if (demande) {
          this.filteredDemandes = [demande];
          this.totalItems = 1;
        } else {
          this.filteredDemandes = [];
          this.totalItems = 0;
        }
        this.currentPage = 1;
        this.loading = false;
        // NE PAS recalculer les totaux - ils restent basés sur toutes les demandes acceptées
      },
      error: (err) => {
        console.error('Erreur lors de la recherche', err);
        this.filteredDemandes = [];
        this.totalItems = 0;
        this.loading = false;
        this.error = true;
        this.errorMessage = 'Demande non trouvée ou erreur de recherche.';
        // NE PAS recalculer les totaux - ils restent constants même en cas d'erreur
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Réinitialiser à la première page
  }

  rejeterDemande(id: number): void {
    // Demander le motif de rejet
    const motifRejet = prompt('Veuillez saisir le motif de rejet:');

    // Vérifier si l'utilisateur a fourni un motif ou annulé
    if (motifRejet === null) {
      return; // L'utilisateur a annulé
    }

    if (motifRejet.trim() === '') {
      alert('Le motif de rejet est obligatoire.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) {
      this.demandeService.rejeterDemande(id, motifRejet).subscribe({
        next: () => {
          // Retirer la demande rejetée des deux listes
          this.demandesAcceptees = this.demandesAcceptees.filter(d => d.id !== id);
          this.filteredDemandes = this.filteredDemandes.filter(d => d.id !== id);
          this.totalItems = this.filteredDemandes.length;

          // Recalculer les totaux après suppression réelle d'une demande
          this.calculerTotauxParType();

          alert('La demande a été rejetée avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors du rejet de la demande', err);
          alert('Une erreur est survenue lors du rejet de la demande.');
        }
      });
    }
  }

  validerDemande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir valider cette demande ?')) {
      this.demandeService.validerDemande(id).subscribe({
        next: () => {
          // Retirer la demande validée des deux listes
          this.demandesAcceptees = this.demandesAcceptees.filter(d => d.id !== id);
          this.filteredDemandes = this.filteredDemandes.filter(d => d.id !== id);
          this.totalItems = this.filteredDemandes.length;

          // Recalculer les totaux après suppression réelle d'une demande
          this.calculerTotauxParType();

          alert('La demande a été validée avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la validation de la demande', err);
          alert('Une erreur est survenue lors de la validation de la demande.');
        }
      });
    }
  }

  detailsDemande(demande: SoumissionDto): void {
    if (demande && demande.id) {
      this.router.navigate(['/detailsDemande', demande.id]);
    }
  }
}


