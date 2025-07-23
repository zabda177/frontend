/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 23/07/2025 - 13:25:23
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/07/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { Component } from '@angular/core';
import { SoumissionDto } from '../../../components/demande-certificat/model/demande';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';
import { ToastrService } from 'ngx-toastr';
import { PieceJointeService } from '../../../components/demande-certificat/service/piece-jointe.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-details-demande',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './details-demande.component.html',
  styleUrl: './details-demande.component.css'
})
export class DetailsDemandeComponent {

  demande: SoumissionDto | null = null;
  piecesJointes: any[] = []; // Tableau pour stocker les pièces jointes
  loading = true;
  loadingPieces = true;
  error = false;
  errorMessage = '';
  demandeId: number = 0;
  url: any;

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


  getPersonnePhysiqueInfo(field: string): any {
    if (!this.demande) return '';

    // verification de type avec any
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


  getFileNameFromPieceJointe(pieceJointe: any): string {
    if (!pieceJointe) return 'fichier_inconnu';

    // Essayer différentes propriétés possibles pour le nom du fichier
    if (pieceJointe.fileName) return pieceJointe.fileName;
    if (pieceJointe.name) return pieceJointe.name;
    if (pieceJointe.libelle) return `${pieceJointe.libelle}.pdf`; // Assumer PDF par défaut
    if (pieceJointe.originalName) return pieceJointe.originalName;

    // Extraire le nom du fichier depuis l'URL si possible
    if (pieceJointe.url) {
      const urlParts = pieceJointe.url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart.includes('.')) {
        return lastPart;
      }
    }

    // Nom par défaut basé sur le libellé ou un nom générique
    return pieceJointe.libelle ? `${pieceJointe.libelle}.pdf` : 'document.pdf';
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

  downloadPieceJointe(pieceJointe: any): void {
    // Vérification de l'objet pièce jointe
    if (!pieceJointe) {
      this.toastr.error('Objet pièce jointe invalide', 'Erreur');
      console.error('Tentative de téléchargement avec un objet invalide:', pieceJointe);
      return;
    }

    // Vérification de l'URL
    if (!pieceJointe.url || pieceJointe.url.trim() === '') {
      this.toastr.error('URL de fichier invalide ou manquante', 'Erreur');
      console.error('Tentative de téléchargement avec une URL invalide:', pieceJointe.url);
      return;
    }

    try {
      console.log('Téléchargement du fichier avec URL:', pieceJointe.url);
      console.log('Libellé du fichier:', pieceJointe.libelle);

      // Afficher un indicateur de chargement
      this.toastr.info('Téléchargement en cours...', 'Information');

      this.demandeService.downloadFileByUrl(pieceJointe.url).subscribe({
        next: (response: Blob) => {
          if (!response || response.size === 0) {
            this.toastr.error('Le fichier téléchargé est vide', 'Erreur');
            return;
          }

          console.log('Fichier reçu, taille:', response.size, 'octets');

          // Création d'une URL pour le blob
          const url = window.URL.createObjectURL(response);

          // Création d'un élément <a> pour déclencher le téléchargement
          const link = document.createElement('a');
          link.href = url;

          // Déterminer le nom du fichier
          let downloadName = this.getFileNameFromPieceJointe(pieceJointe);

          link.download = downloadName;

          // Ajout de l'élément au DOM, clic, et suppression
          document.body.appendChild(link);
          link.click();

          // Nettoyage
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
          }, 100);

          this.toastr.success(`Fichier "${downloadName}" téléchargé avec succès`, 'Succès');
          console.log('Téléchargement réussi pour:', downloadName);
        },
        error: (err) => {
          console.error('Erreur lors du téléchargement du fichier:', err);
          const errorMessage = err.message || 'Erreur inconnue lors du téléchargement';
          this.toastr.error(errorMessage, 'Erreur de téléchargement');
        }
      });
    } catch (error) {
      console.error('Exception lors du téléchargement:', error);
      this.toastr.error('Une erreur inattendue s\'est produite lors du téléchargement', 'Erreur');
    }
  }

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
