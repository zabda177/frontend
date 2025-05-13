/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 24/04/2025 - 14:02:11
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/04/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SoumissionDto } from '../../../components/demande-certificat/model/demande';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';

@Component({
  selector: 'app-demandes-rejete',
  templateUrl: './demandes-rejete.component.html',
  styleUrls: ['./demandes-rejete.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxPaginationModule]
})
export class DemandesRejeteComponent implements OnInit {
  demandesRejetees: SoumissionDto[] = [];
  filteredDemandes: SoumissionDto[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  searchTerm = '';

  // Propriété pour le modal de rejet
  motifRejet?: string;
  motifRejetError = false;
  selectedDemande: SoumissionDto | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private demandeService: DemandeServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDemandesRejetees();
  }

  loadDemandesRejetees(): void {
    this.loading = true;
    this.error = false;

    this.demandeService.getDemandeRejete().subscribe({
      next: (demandes) => {
        // Mapper les données si nécessaire pour assurer que les propriétés existent
        this.demandesRejetees = demandes.map(demande => ({
          ...demande,
          // S'assurer que les propriétés existent avec des valeurs par défaut
          dateRejet: demande.dateRejet || null,
          motifRejet: demande.motifRejet || ''
        }));
        this.filteredDemandes = [...this.demandesRejetees];
        this.totalItems = this.demandesRejetees.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes rejetées', err);
        this.error = true;
        this.errorMessage = 'Impossible de charger les demandes rejetées. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  filterDemandes(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDemandes = [...this.demandesRejetees];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredDemandes = this.demandesRejetees.filter(demande =>
        demande.codeDemande?.toLowerCase().includes(searchTermLower) ||
        demande.id?.toString().includes(searchTermLower) ||
        demande.typeDemandeur?.toLowerCase().includes(searchTermLower) ||
        demande.motifRejet?.toLowerCase().includes(searchTermLower)
      );
    }
    this.totalItems = this.filteredDemandes.length;
    this.currentPage = 1;
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

  openReconsiderationModal(demande: SoumissionDto): void {
    this.selectedDemande = demande;
    const modal = document.getElementById('reconsiderationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode?.removeChild(backdrop);
      }
    }
  }

  reconsidererDemande(): void {
    if (this.selectedDemande && this.selectedDemande.id) {
      this.demandeService.reconsidererDemande(this.selectedDemande.id).subscribe({
        next: () => {
          this.closeModal('reconsiderationModal');
          this.demandesRejetees = this.demandesRejetees.filter(d => d.id !== this.selectedDemande?.id);
          this.filterDemandes();
          alert('La demande a été remise en cours de traitement avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la reconsidération de la demande', err);
          alert('Une erreur est survenue lors de la reconsidération de la demande.');
        }
      });
    }
  }

  confirmerRejet(): void {
    if (this.selectedDemande && this.selectedDemande.id && this.motifRejet) {
      this.demandeService.rejeterDemande(this.selectedDemande.id, this.motifRejet).subscribe({
        next: () => {
          this.closeModal('rejetModal');
          this.motifRejet = '';
          alert('La demande a été rejetée avec succès.');
          this.loadDemandesRejetees();
        },
        error: (err) => {
          console.error('Erreur lors du rejet de la demande', err);
          alert('Une erreur est survenue lors du rejet de la demande.');
        }
      });
    } else {
      this.motifRejetError = true;
    }
  }

  openRejetModal(demande: SoumissionDto): void {
    this.selectedDemande = demande;
    this.motifRejet = '';
    this.motifRejetError = false;
    const modal = document.getElementById('rejetModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }
}







// /**
//     * @description      :
//     * @author           : ASUS
//     * @group            :
//     * @created          : 24/04/2025 - 14:02:11
//     *
//     * MODIFICATION LOG
//     * - Version         : 1.0.0
//     * - Date            : 24/04/2025
//     * - Author          : ASUS
//     * - Modification    :
// **/
// import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { Router } from '@angular/router';

// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { SoumissionDto } from '../../../components/demande-certificat/model/demande';
// import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';

// //declare var bootstrap: any; // Pour utiliser Bootstrap modals

// @Component({
//   selector: 'app-demandes-rejete',
//   templateUrl: './demandes-rejete.component.html',
//   styleUrls: ['./demandes-rejete.component.scss'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule, NgxPaginationModule]
// })
// export class DemandesRejeteComponent implements OnInit {
//   demandesRejetees: SoumissionDto[] = [];
//   filteredDemandes: SoumissionDto[] = [];
//   loading = true;
//   error = false;
//   errorMessage = '';
//   searchTerm = '';

//   dateRejet?: Date | string; // Assurez-vous que cette propriété existe
//   motifRejet?: string;       //
//   // Pour le modal de rejet

//   motifRejetError = false;
//   selectedDemande: SoumissionDto | null = null;
//   //rejetModal: any;
//   // reconsiderationModal: any;

//   // Pagination
//   currentPage = 1;
//   itemsPerPage = 10;
//   totalItems = 0;

//   constructor(
//     private demandeService: DemandeServiceService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.loadDemandesRejetees();
//   }



//   loadDemandesRejetees(): void {
//     this.loading = true;
//     this.error = false;

//     this.demandeService.getDemandeRejete().subscribe({
//       next: (demandes) => {
//         this.demandesRejetees = demandes;
//         this.filteredDemandes = [...demandes];
//         this.totalItems = demandes.length;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Erreur lors du chargement des demandes rejetées', err);
//         this.error = true;
//         this.errorMessage = 'Impossible de charger les demandes rejetées. Veuillez réessayer plus tard.';
//         this.loading = false;
//       }
//     });
//   }

//   filterDemandes(): void {
//     if (!this.searchTerm.trim()) {
//       this.filteredDemandes = [...this.demandesRejetees];
//     } else {
//       const searchTermLower = this.searchTerm.toLowerCase();
//       this.filteredDemandes = this.demandesRejetees.filter(demande =>
//       (demande.codeDemande?.toLowerCase().includes(searchTermLower) ||
//         demande.id?.toString().includes(searchTermLower) ||
//         demande.typeDemandeur?.toLowerCase().includes(searchTermLower))
//       );
//     }
//     this.totalItems = this.filteredDemandes.length;
//     this.currentPage = 1; // Revenir à la première page après filtrage
//   }

//   onPageChange(page: number): void {
//     this.currentPage = page;
//   }

//   onItemsPerPageChange(): void {
//     this.currentPage = 1; // Réinitialiser à la première page
//   }

//   viewDetails(demande: SoumissionDto): void {
//     if (demande && demande.id) {
//       this.router.navigate(['/details-demande', demande.id]);
//     }
//   }

//   // Ouvrir le modal pour reconsidérer une demande
//   openReconsiderationModal(demande: SoumissionDto): void {
//     this.selectedDemande = demande;
//     // Utilisez JavaScript natif pour ouvrir le modal
//     const modal = document.getElementById('reconsiderationModal');
//     if (modal) {
//       modal.classList.add('show');
//       modal.style.display = 'block';
//       document.body.classList.add('modal-open');
//       const backdrop = document.createElement('div');
//       backdrop.className = 'modal-backdrop fade show';
//       document.body.appendChild(backdrop);
//     }
//   }


//   closeModal(modalId: string): void {
//     const modal = document.getElementById(modalId);
//     if (modal) {
//       modal.classList.remove('show');
//       modal.style.display = 'none';
//       document.body.classList.remove('modal-open');
//       const backdrop = document.querySelector('.modal-backdrop');
//       if (backdrop) {
//         backdrop.parentNode?.removeChild(backdrop);
//       }
//     }
//   }

//   // Reconsidérer une demande rejetée
//   reconsidererDemande(): void {
//     if (this.selectedDemande && this.selectedDemande.id) {
//       this.demandeService.reconsidererDemande(this.selectedDemande.id).subscribe({
//         next: () => {
//           this.closeModal('reconsiderationModal');
//           // Retirer la demande reconsidérée des demandes rejetées
//           this.demandesRejetees = this.demandesRejetees.filter(d => d.id !== this.selectedDemande?.id);
//           this.filterDemandes(); // Mettre à jour le filtrage
//           alert('La demande a été remise en cours de traitement avec succès.');
//         },
//         error: (err) => {
//           console.error('Erreur lors de la reconsidération de la demande', err);
//           alert('Une erreur est survenue lors de la reconsidération de la demande.');
//         }
//       });
//     }
//   }

//   getDemandeRejete(): void {
//     // Si c'est pour confirmer un rejet depuis un modal
//     if (this.selectedDemande && this.selectedDemande.id && this.motifRejet) {
//       this.demandeService.rejeterDemande(this.selectedDemande.id, this.motifRejet).subscribe({
//         next: () => {
//           this.closeModal('rejetModal');
//           this.loadDemandesRejetees(); // Recharger la liste
//           this.motifRejet = ''; // Réinitialiser le motif
//           alert('La demande a été rejetée avec succès.');
//         },
//         error: (err) => {
//           console.error('Erreur lors du rejet de la demande', err);
//           alert('Une erreur est survenue lors du rejet de la demande.');
//         }
//       });
//     } else {
//       this.motifRejetError = true;
//     }
//   }

//   confirmerRejet(): void {
//     if (this.selectedDemande && this.selectedDemande.id && this.motifRejet) {
//       this.demandeService.rejeterDemande(this.selectedDemande.id, this.motifRejet).subscribe({
//         next: () => {
//           this.closeModal('rejetModal');
//           this.motifRejet = '';
//           alert('La demande a été rejetée avec succès.');
//           this.loadDemandesRejetees(); // Recharger la liste
//         },
//         error: (err) => {
//           console.error('Erreur lors du rejet de la demande', err);
//           alert('Une erreur est survenue lors du rejet de la demande.');
//         }
//       });
//     } else {
//       this.motifRejetError = true;
//     }
//   }

//   openRejetModal(demande: SoumissionDto): void {
//     this.selectedDemande = demande;
//     this.motifRejet = '';
//     this.motifRejetError = false;
//     const modal = document.getElementById('rejetModal');
//     if (modal) {
//       modal.classList.add('show');
//       modal.style.display = 'block';
//       document.body.classList.add('modal-open');
//       const backdrop = document.createElement('div');
//       backdrop.className = 'modal-backdrop fade show';
//       document.body.appendChild(backdrop);
//     }
//   }

// }






