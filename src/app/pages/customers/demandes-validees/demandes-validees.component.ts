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

  filterDemandes(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDemandes = [...this.demandesValidees];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredDemandes = this.demandesValidees.filter(demande =>
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

  viewDetails(demande: SoumissionDto): void {
    if (demande && demande.id) {
      this.router.navigate(['/details-demande', demande.id]);
    }
  }

  // genererCertificat(id: number): void {
  //   if (confirm('Êtes-vous sûr de vouloir générer un certificat pour cette demande ?')) {
  //     this.demandeService.genererCertificat(id).subscribe({
  //       next: () => {
  //         alert('Le certificat a été généré avec succès.');
  //         // Optionally refresh the list or update status
  //         this.loadDemandesValidees();
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors de la génération du certificat', err);
  //         alert('Une erreur est survenue lors de la génération du certificat.');
  //       }
  //     });
  //   }
  // }
}







// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-demandes-validees',
//   standalone: true,
//   imports: [],
//   templateUrl: './demandes-validees.component.html',
//   styleUrl: './demandes-validees.component.css'
// })
// export class DemandesValideesComponent {

// }
