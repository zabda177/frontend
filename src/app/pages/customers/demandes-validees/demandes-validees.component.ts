/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 24/04/2025 - 01:58:07
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/04/2025
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

// Interface pour les totaux par type
interface TotalParType {
  typeDemande: string;
  nombre: number;
}

@Component({
  selector: 'app-demandes-validees',
  templateUrl: './demandes-validees.component.html',
  styleUrls: ['./demandes-validees.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxPaginationModule]
})
export class DemandesValideesComponent implements OnInit {
  demandesValidees: SoumissionDto[] = [];
  filteredDemandes: SoumissionDto[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  searchTerm = '';

  // Totaux par type de demande - TOUJOURS basés sur toutes les demandes validées
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
    this.loadDemandesValidees();
  }

  loadDemandesValidees(): void {
    this.loading = true;
    this.error = false;

    this.demandeService.getDemandeValide().subscribe({
      next: (demandes) => {
        this.demandesValidees = demandes;
        this.filteredDemandes = [...demandes];
        this.totalItems = demandes.length;
        // Calculer les totaux UNE SEULE FOIS sur toutes les demandes
        this.calculerTotauxParType();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes validées', err);
        this.error = true;
        this.errorMessage = 'Impossible de charger les demandes validées. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  calculerTotauxParType(): void {
    // IMPORTANT: Toujours calculer sur demandesValidees (toutes les données)
    // et NON sur filteredDemandes
    const compteurs = new Map<string, number>();

    this.demandesValidees.forEach(demande => {
      const typeDemande = demande.typeDemande || 'Non spécifié';
      compteurs.set(typeDemande, (compteurs.get(typeDemande) || 0) + 1);
    });

    // Convertir le Map en tableau et trier par nombre décroissant
    this.totalParType = Array.from(compteurs.entries())
      .map(([typeDemande, nombre]) => ({ typeDemande, nombre }))
      .sort((a, b) => b.nombre - a.nombre);

    // Calculer le total général sur TOUTES les demandes validées
    this.totalGeneral = this.demandesValidees.length;
  }

  filterDemandes(): void {
    if (!this.searchTerm.trim()) {
      // Si pas de recherche, afficher toutes les demandes
      this.filteredDemandes = [...this.demandesValidees];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredDemandes = this.demandesValidees.filter(demande =>
      (demande.codeDemande?.toLowerCase().includes(searchTermLower) ||
        demande.id?.toString().includes(searchTermLower) ||
        demande.typeDemandeur?.toLowerCase().includes(searchTermLower) ||
        demande.typeDemande?.toLowerCase().includes(searchTermLower))
      );
    }

    this.totalItems = this.filteredDemandes.length;
    this.currentPage = 1;

    // NE PAS recalculer les totaux - ils restent basés sur toutes les demandes validées
    // this.calculerTotauxParType(); // <- Cette ligne a été supprimée
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  viewDetails(demande: SoumissionDto): void {
    if (demande && demande.id) {
      this.router.navigate(['/details-demande', demande.id]);
    }
  }
}
