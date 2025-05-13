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
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';

@Component({
  selector: 'app-demande-soumise',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgxPaginationModule,

  ],

  templateUrl: './demande-soumise.component.html',
  styleUrl: './demande-soumise.component.css'
})
export class DemandeSoumiseComponent implements OnInit {
  // Liste complète des demandes
  demandes: SoumissionDto[] = [];
  // Liste filtrée pour l'affichage
  filteredDemandes: SoumissionDto[] = [];
  motifRejet: string = '';
  // Variables pour la recherche
  searchTerm = '';

  // Variables pour la pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // État de chargement et erreurs
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private demandeService: DemandeServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadDemandes();
  }

  /**
   * Charge la liste des demandes en cours depuis le service
   */
  loadDemandes(): void {
    this.loading = true;
    this.error = false;

    this.demandeService.getDemandeEncours().subscribe({
      next: (data: SoumissionDto[]) => {
        this.demandes = data;
        this.filteredDemandes = [...this.demandes];
        this.totalItems = this.filteredDemandes.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
        this.error = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des demandes. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  /**
   * Filtre les demandes selon le terme de recherche
   */
  filterDemandes(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDemandes = [...this.demandes];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.filteredDemandes = this.demandes.filter(demande => {
        // Recherche sur plusieurs champs
        return (
          (demande.codeDemande && demande.codeDemande.toLowerCase().includes(searchTermLower)) ||
          (demande.numeroDemande && demande.numeroDemande.toString().includes(searchTermLower)) ||
          (demande.typeDemandeur?.toLowerCase().includes(searchTermLower)) || // Utilisation de l'opérateur optionnel
          (demande.typeDemande?.toLowerCase().includes(searchTermLower))  // Utilisation de l'opérateur optionnel
        );
      });
    }
    this.totalItems = this.filteredDemandes.length;
    this.currentPage = 1; // Retour à la première page après filtrage
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
    this.currentPage = 1; // Retour à la première page
  }

  /**
   * Accepte une demande
   */
  accepterDemande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir accepter cette demande ?')) {
      this.demandeService.accepterDemande(id).subscribe({
        next: (response) => {
          this.toastr.success('La demande a été acceptée avec succès', 'Succès');
          this.loadDemandes(); // Recharger la liste
        },
        error: (err) => {
          console.error('Erreur lors de l\'acceptation de la demande', err);
          this.toastr.error('Une erreur est survenue lors de l\'acceptation de la demande', 'Erreur');
        }
      });
    }
  }

  /**
   * Rejette une demande
   */
  rejeterDemande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) {
      this.demandeService.rejeterDemande(id, this.motifRejet).subscribe({
        next: (response) => {
          this.toastr.success('La demande a été rejetée avec succès', 'Succès');
          this.loadDemandes(); // Recharger la liste
        },
        error: (err) => {
          console.error('Erreur lors du rejet de la demande', err);
          this.toastr.error('Une erreur est survenue lors du rejet de la demande', 'Erreur');
        }
      });
    }
  }
}
