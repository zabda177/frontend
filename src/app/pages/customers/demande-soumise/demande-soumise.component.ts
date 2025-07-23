/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 23/04/2025 - 20:35:07
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/04/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { SoumissionDto } from './../../../components/demande-certificat/model/demande';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';

// Interface pour les totaux par type
interface TotalParType {
  typeDemande: string;
  nombre: number;
}

// Interface pour les totaux par statut
interface TotalParStatut {
  statut: string;
  nombre: number;
}

@Component({
  selector: 'app-demande-soumise',
  templateUrl: './demande-soumise.component.html',
  styleUrls: ['./demande-soumise.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxPaginationModule]
})
export class DemandeSoumiseComponent implements OnInit {
  demandesEnCours: SoumissionDto[] = [];
  filteredDemandes: SoumissionDto[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  searchTerm = '';
  motifRejet = '';

  // Totaux par type de demande - TOUJOURS basés sur toutes les demandes en cours
  totalParType: TotalParType[] = [];
  totalParStatut: TotalParStatut[] = [];
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
    this.loadDemandesEnCours();
  }

  /**
   * Charge la liste des demandes en cours depuis le service
   */
  loadDemandesEnCours(): void {
    this.loading = true;
    this.error = false;

    this.demandeService.getDemandeEncours().subscribe({
      next: (demandes) => {
        this.demandesEnCours = demandes;
        this.filteredDemandes = [...demandes];
        this.totalItems = demandes.length;
        // Calculer les totaux UNE SEULE FOIS sur toutes les demandes
        this.calculerTotauxParType();
        this.calculerTotauxParStatut();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes en cours', err);
        this.error = true;
        this.errorMessage = 'Impossible de charger les demandes en cours. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  /**
   * Calcule les totaux par type de demande
   */
  calculerTotauxParType(): void {
    // IMPORTANT: Toujours calculer sur demandesEnCours (toutes les données)
    // et NON sur filteredDemandes
    const compteurs = new Map<string, number>();

    this.demandesEnCours.forEach(demande => {
      const typeDemande = demande.typeDemande || 'Non spécifié';
      compteurs.set(typeDemande, (compteurs.get(typeDemande) || 0) + 1);
    });

    // Convertir le Map en tableau et trier par nombre décroissant
    this.totalParType = Array.from(compteurs.entries())
      .map(([typeDemande, nombre]) => ({ typeDemande, nombre }))
      .sort((a, b) => b.nombre - a.nombre);

    // Calculer le total général sur TOUTES les demandes en cours
    this.totalGeneral = this.demandesEnCours.length;
  }

  /**
   * Calcule les totaux par statut
   */
  calculerTotauxParStatut(): void {
    // IMPORTANT: Toujours calculer sur demandesEnCours (toutes les données)
    // et NON sur filteredDemandes
    const compteurs = new Map<string, number>();

    this.demandesEnCours.forEach(demande => {
      const statut = demande.statut || 'Non spécifié';
      compteurs.set(statut, (compteurs.get(statut) || 0) + 1);
    });

    this.totalParStatut = Array.from(compteurs.entries())
      .map(([statut, nombre]) => ({ statut, nombre }))
      .sort((a, b) => b.nombre - a.nombre);
  }

  /**
   * Filtre les demandes selon le terme de recherche
   */
  filterDemandes(): void {
    const code = this.searchTerm.trim();

    if (!code) {
      // Si pas de recherche, afficher toutes les demandes
      this.filteredDemandes = [...this.demandesEnCours];
      this.totalItems = this.demandesEnCours.length;
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
        // NE PAS recalculer les totaux - ils restent basés sur toutes les demandes en cours
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

  /**
   * Gère le changement de page
   */
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  /**
   * Gère le changement du nombre d'éléments par page
   */
  onItemsPerPageChange(): void {
    this.currentPage = 1; // Réinitialiser à la première page
  }

  /**
   * Accepte une demande
   */
  accepterDemande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir accepter cette demande ?')) {
      this.demandeService.accepterDemande(id).subscribe({
        next: () => {
          // Retirer la demande acceptée des deux listes
          this.demandesEnCours = this.demandesEnCours.filter(d => d.id !== id);
          this.filteredDemandes = this.filteredDemandes.filter(d => d.id !== id);
          this.totalItems = this.filteredDemandes.length;

          // Recalculer les totaux après suppression réelle d'une demande
          this.calculerTotauxParType();
          this.calculerTotauxParStatut();

          alert('La demande a été acceptée avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de l\'acceptation de la demande', err);
          alert('Une erreur est survenue lors de l\'acceptation de la demande.');
        }
      });
    }
  }

  /**
   * Rejette une demande
   */
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
          this.demandesEnCours = this.demandesEnCours.filter(d => d.id !== id);
          this.filteredDemandes = this.filteredDemandes.filter(d => d.id !== id);
          this.totalItems = this.filteredDemandes.length;

          // Recalculer les totaux après suppression réelle d'une demande
          this.calculerTotauxParType();
          this.calculerTotauxParStatut();

          alert('La demande a été rejetée avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors du rejet de la demande', err);
          alert('Une erreur est survenue lors du rejet de la demande.');
        }
      });
    }
  }

  viewDetails(demande: SoumissionDto): void {
    if (demande && demande.id) {
      this.router.navigate(['/details-demande', demande.id]);
    }
  }
}
