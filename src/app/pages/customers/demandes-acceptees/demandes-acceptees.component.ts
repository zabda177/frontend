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

@Component({
  selector: 'app-demandes-acceptees',
  templateUrl: './demandes-acceptees.component.html',
  styleUrls: ['./demandes-acceptees.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxPaginationModule]
})
export class DemandesAccepteesComponent implements OnInit {
  demandesAcceptees: SoumissionDto[] = [];
  filteredDemandes: SoumissionDto[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  searchTerm = '';
  motifRejet = '';

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

  filterDemandes(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDemandes = [...this.demandesAcceptees];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredDemandes = this.demandesAcceptees.filter(demande =>
      (demande.codeDemande?.toLowerCase().includes(searchTermLower) ||
        demande.id?.toString().includes(searchTermLower) ||
        demande.typeDemandeur?.toLowerCase().includes(searchTermLower))
      );
    }
    this.totalItems = this.filteredDemandes.length;
    this.currentPage = 1; // Revenir à la première page après filtrage
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
          // Retirer la demande rejetée des demandes acceptées
          this.demandesAcceptees = this.demandesAcceptees.filter(d => d.id !== id);
          this.filterDemandes(); // Mettre à jour le filtrage
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
          // Retirer la demande validée des demandes acceptées
          this.demandesAcceptees = this.demandesAcceptees.filter(d => d.id !== id);
          this.filterDemandes(); // Mettre à jour le filtrage
          alert('La demande a été validée avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la validation de la demande', err);
          alert('Une erreur est survenue lors de la validation de la demande.');
        }
      });
    }
  }
}
