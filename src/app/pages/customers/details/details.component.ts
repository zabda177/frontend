/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 25/04/2025 - 09:33:53
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/04/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';
import { PieceJointeService } from '../../../components/demande-certificat/service/piece-jointe.service';
import { SoumissionDto } from '../../../components/demande-certificat/model/demande';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-details-demande',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'

})
export class DetailsComponent implements OnInit {
  demande: SoumissionDto | null = null;
  piecesJointes: any[] = []; // Tableau pour stocker les pièces jointes
  loading = true;
  loadingPieces = true;
  error = false;
  errorMessage = '';
  demandeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private demandeService: DemandeServiceService,
    private pieceJointeService: PieceJointeService, // Injection du service PieceJointe
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.demandeId = +params['id']; // Convertir l'id en nombre
      if (this.demandeId) {
        this.loadDemandeDetails();
      } else {
        this.error = true;
        this.errorMessage = 'Identifiant de demande invalide';
        this.loading = false;
      }
    });
  }



  // Dans votre classe DetailsComponent
  getPersonnePhysiqueInfo(field: string): any {
    if (!this.demande) return '';

    // Utiliser 'as any' pour contourner la vérification de type
    const personnePh = (this.demande as any).personnePhysiqueDTO;

    if (!personnePh) return '';

    return personnePh[field] || '';
  }


  getPersonneMoraleinfo(field: string): any {
    if (!this.demande) return '';

    const personnMl = (this.demande as any).personneMoraleDTO;
    if (!personnMl) return '';
    return personnMl[field] || '';
  }

  loadDemandeDetails(): void {
    this.loading = true;
    this.error = false;

    this.demandeService.getDemandeById(this.demandeId).subscribe({
      next: (data: SoumissionDto) => {
        this.demande = data;
        console.log('Type demandeur:', this.demande.typeDemandeur);
        console.log('Structure complète de la demande:', JSON.stringify(this.demande, null, 2));
        this.loading = false;
        this.loadPiecesJointes();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails de la demande', err);
        this.error = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des détails de la demande. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  /**
   * Charge les pièces jointes de la demande
   */
  loadPiecesJointes(): void {
    this.loadingPieces = true;

    this.pieceJointeService.getPiecesJointesByDemande(this.demandeId).subscribe({
      next: (pieces: any[]) => {
        this.piecesJointes = pieces;
        this.loadingPieces = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des pièces jointes', err);
        this.loadingPieces = false;
        this.toastr.warning('Impossible de charger les pièces jointes', 'Attention');
      }
    });
  }

  downloadPieceJointe(fileName: string): void {
    // Vérification plus complète du nom de fichier
    if (!fileName || fileName.trim() === '') {
      this.toastr.error('Nom de fichier invalide ou manquant', 'Erreur');
      console.error('Tentative de téléchargement avec un nom de fichier invalide:', fileName);
      return;
    }

    try {
      console.log('Téléchargement du fichier:', fileName);

      // Extraction du nom de fichier seul, sans chemin complet
      const fileNameOnly = fileName.split('\\').pop()?.split('/').pop();

      // Vérification supplémentaire après l'extraction
      if (!fileNameOnly || fileNameOnly.trim() === '') {
        this.toastr.error('Impossible d\'extraire un nom de fichier valide', 'Erreur');
        console.error('Extraction de nom de fichier a échoué:', fileName);
        return;
      }

      // Assainir le nom de fichier pour éviter les caractères problématiques
      const safeFileName = fileNameOnly.replace(/[^\w\-\.\s]/g, '_');

      // Utilise la méthode downloadFile du service avec le nom de fichier propre
      this.pieceJointeService.downloadFile(safeFileName).subscribe({
        next: (response: Blob) => {
          if (!response || response.size === 0) {
            this.toastr.error('Le fichier téléchargé est vide', 'Erreur');
            return;
          }

          // Création d'une URL pour le blob
          const url = window.URL.createObjectURL(response);

          // Création d'un élément <a> pour déclencher le téléchargement
          const link = document.createElement('a');
          link.href = url;
          link.download = safeFileName; // Nom du fichier pour le téléchargement

          // Ajout de l'élément au DOM, clic, et suppression
          document.body.appendChild(link);
          link.click();

          // Nettoyage
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
          }, 100);

          this.toastr.success('Téléchargement réussi', 'Succès');
        },
        error: (err) => {
          console.error('Erreur lors du téléchargement du fichier:', err);
          this.toastr.error(`Erreur lors du téléchargement: ${err.message || 'Erreur inconnue'}`, 'Erreur');
        }
      });
    } catch (error) {
      console.error('Exception lors du téléchargement:', error);
      this.toastr.error('Une erreur inattendue s\'est produite', 'Erreur');
    }
  }




  /**
 * Télécharger une pièce jointe
 */
  // downloadPieceJointe(fileName: string): void {
  //   // Vérification plus complète du nom de fichier
  //   if (!fileName || fileName.trim() === '') {
  //     this.toastr.error('Nom de fichier invalide ou manquant', 'Erreur');
  //     console.error('Tentative de téléchargement avec un nom de fichier invalide:', fileName);
  //     return;
  //   }

  //   try {
  //     console.log('Téléchargement du fichier:', fileName);

  //     // Utilise la méthode downloadFile du service à la place de getFileUrl
  //     this.pieceJointeService.downloadFile(fileName).subscribe({
  //       next: (response: any) => {
  //         // Création d'un blob à partir de la réponse
  //         const blob = new Blob([response], { type: response.type || 'application/octet-stream' });

  //         // Création d'une URL pour le blob
  //         const url = window.URL.createObjectURL(blob);

  //         // Création d'un élément <a> pour déclencher le téléchargement
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.download = fileName; // Nom du fichier pour le téléchargement

  //         // Ajout de l'élément au DOM, clic, et suppression
  //         document.body.appendChild(link);
  //         link.click();

  //         // Nettoyage
  //         window.URL.revokeObjectURL(url);
  //         document.body.removeChild(link);

  //         this.toastr.success('Téléchargement réussi', 'Succès');
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors du téléchargement du fichier:', err);
  //         this.toastr.error('Erreur lors du téléchargement du fichier', 'Erreur');
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Exception lors du téléchargement:', error);
  //     this.toastr.error('Une erreur inattendue s\'est produite', 'Erreur');
  //   }
  // }

  /**
   * Retour à la liste des demandes
   */
  retourListe(): void {
    this.router.navigate(['/demandes-soumises']);
  }

  /**
   * Accepter la demande
   */
  accepterDemande(): void {
    if (confirm('Êtes-vous sûr de vouloir accepter cette demande ?')) {
      this.demandeService.accepterDemande(this.demandeId).subscribe({
        next: () => {
          this.toastr.success('La demande a été acceptée avec succès', 'Succès');
          this.loadDemandeDetails(); // Recharger pour voir le statut mis à jour
        },
        error: (err) => {
          console.error('Erreur lors de l\'acceptation de la demande', err);
          this.toastr.error('Une erreur est survenue lors de l\'acceptation de la demande', 'Erreur');
        }
      });
    }
  }

  /**
   * Rejeter la demande
   */
  rejeterDemande(): void {
    const motif = prompt('Veuillez entrer le motif du rejet:');
    if (motif) {
      this.demandeService.rejeterDemande(this.demandeId, motif).subscribe({
        next: () => {
          this.toastr.success('La demande a été rejetée avec succès', 'Succès');
          this.loadDemandeDetails(); // Recharger pour voir le statut mis à jour
        },
        error: (err) => {
          console.error('Erreur lors du rejet de la demande', err);
          this.toastr.error('Une erreur est survenue lors du rejet de la demande', 'Erreur');
        }
      });
    }
  }
}


