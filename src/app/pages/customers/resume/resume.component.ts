/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 08/05/2025 - 02:00:38
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 08/05/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperPrevious, CdkStepperModule } from '@angular/cdk/stepper';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { EnvoiCodeComponent } from '../envoi-code/envoi-code.component';




@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    CommonModule,
    CdkStepperModule,
    CdkStepperPrevious,
    MatDialogModule
  ],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  @Input() demandeurData: any;
  @Input() personneMoraleData: any;
  @Input() typeDemandeur: string = '';
  @Input() typeDemande: string = '';
  @Input() fichierData: any = null; // Modifié: accepter tout type de données
  @Input() demandesData: any;

  // Événement pour déclencher la soumission finale
  @Output() soumissionFinale = new EventEmitter<void>();
  // Ajout de l'événement pour transmettre les données de la demande
  @Output() demandesDataEvent = new EventEmitter<any>();

  // Variable pour suivre l'état de soumission
  soumissionEnCours: boolean = false;

  // Map pour afficher les noms lisibles des types de demande
  typeDemandeLabels: { [key: string]: string } = {
    'licenceGuide': 'Licence Guide',
    'etablissement': 'Création d\'un Établissement',
    'permiPeche': 'Permis de Pêche',
    'licenceCommerciale': 'Licence Commerciale',
    'agrementConcession': 'Agréments et Concessions'
  };

  constructor(
    private dialog: MatDialog,
    private demandeService: DemandeServiceService
  ) { }

  ngOnInit() {
    // Lors de l'initialisation, vérifier et générer les données de la demande si nécessaire
    this.preparerDonneesEtEmettre();
  }

  // Nouvelle méthode pour préparer et émettre les données
  preparerDonneesEtEmettre() {
    // Si demandesData n'existe pas, créer un objet avec les données disponibles
    if (!this.demandesData) {
      this.demandesData = {
        typeDemande: this.typeDemande,
        // Autres propriétés qui pourraient être nécessaires
        dateCreation: new Date().toISOString()
      };

      console.log('Données de demande générées:', this.demandesData);
    }

    // Émettre les données vers le composant parent
    this.demandesDataEvent.emit(this.demandesData);
  }

  // Détermine si les fichiers ont été fournis
  get fichiersFournis(): boolean {
    if (!this.fichierData) {
      return false;
    }

    if (this.fichierData instanceof FormData) {
      // Pour FormData, nous considérons qu'il y a des fichiers
      // Vérifier si la FormData n'est pas vide (contient plus que le champ _type)
      return Array.from(this.fichierData.keys()).some(key => key !== '_type');
    } else if (Array.isArray(this.fichierData)) {
      return this.fichierData.length > 0;
    }

    return false;
  }

  // Récupère la liste des noms de fichiers si possible
  getFichiersNames(): string[] {
    if (!this.fichierData) {
      return [];
    }

    if (this.fichierData instanceof FormData) {
      // Pour FormData, extraire les clés sauf le champ _type
      const keys = Array.from(this.fichierData.keys()).filter(key => key !== '_type');
      return keys.map(key => {
        // Formater le nom de la clé pour qu'il soit plus lisible
        return this.formatLabel(key);
      });
    }

    if (Array.isArray(this.fichierData)) {
      return this.fichierData
        .filter(item => item && (item.fichier || item.file))
        .map(item => {
          if (item.fichier?.name) return item.fichier.name;
          if (item.file?.name) return item.file.name;
          if (item.type) return this.formatLabel(item.type);
          return 'Fichier sans nom';
        });
    }

    // Si c'est un autre type d'objet, essayer d'extraire les clés
    if (typeof this.fichierData === 'object' && this.fichierData !== null) {
      return Object.keys(this.fichierData).map(key => this.formatLabel(key));
    }

    return [];
  }

  // Méthode pour récupérer les clés d'un objet (utile pour l'affichage dynamique)
  getObjectKeys(obj: any): string[] {
    if (!obj) return [];
    return Object.keys(obj);
  }

  // Méthode pour formater les labels (camelCase vers texte lisible)
  formatLabel(key: string): string {
    // Convertir camelCase en mots séparés
    const result = key.replace(/([A-Z])/g, ' $1');
    // Mettre la première lettre en majuscule
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  // Méthode pour soumettre définitivement
  onSoumettreDefinitif() {
    if (this.soumissionEnCours) {
      console.log('Soumission déjà en cours, attente...');
      return;
    }

    // Vérifier que les données nécessaires sont présentes
    if (!this.typeDemandeur) {
      alert('Type de demandeur non défini');
      return;
    }

    if (!this.typeDemande) {
      alert('Type de demande non défini');
      return;
    }

    // Ouvrir le popup de confirmation
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Confirmation de soumission',
        message: 'Êtes-vous sûr de vouloir soumettre cette demande?',
        confirmButton: 'Confirmer',
        cancelButton: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.soumissionEnCours = true;

        // Préparer les données pour la soumission
        const formData = new FormData();

        // Ajouter les données de la demande
        formData.append('demande', JSON.stringify(this.demandesData));

        // Ajouter les données du demandeur
        if (this.typeDemandeur === 'physique') {
          formData.append('personnePhysique', JSON.stringify(this.demandeurData));
        } else if (this.typeDemandeur === 'morale') {
          formData.append('personneMorale', JSON.stringify(this.personneMoraleData));
        }

        // Traitement des fichiers
        if (this.fichierData) {
          if (this.fichierData instanceof FormData) {
            // Si c'est déjà un FormData, on extrait les fichiers
            const entries = Array.from(this.fichierData.entries());
            for (const [key, value] of entries) {
              if (value instanceof File) {
                formData.append('fichiers', value, value.name);
              }
            }
          } else if (Array.isArray(this.fichierData)) {
            // Si c'est un tableau de fichiers
            this.fichierData.forEach((fichier: any) => {
              if (fichier.fichier instanceof File) {
                formData.append('fichiers', fichier.fichier, fichier.fichier.name);
              } else if (fichier.file instanceof File) {
                formData.append('fichiers', fichier.file, fichier.file.name);
              }
            });
          } else if (typeof this.fichierData === 'object') {
            // Si c'est un objet contenant des fichiers
            Object.keys(this.fichierData).forEach(key => {
              const fichier = this.fichierData[key];
              if (fichier instanceof File) {
                formData.append('fichiers', fichier, fichier.name);
              }
            });
          }
        }

        // Soumettre la demande au serveur
        this.demandeService.envoyerToutesDonnees(formData).subscribe({
          next: (response) => {
            console.log('Demande soumise avec succès:', response);

            // Stocker la réponse dans le service pour un accès ultérieur
            if (response) {
              this.demandeService.setDemandeSoumise(response);

              // Mettre à jour les données locales avec le code reçu du serveur
              if (response.codeDemande) {
                this.demandesData.codeDemande = response.codeDemande;
              }
            }

            // Émettre l'événement pour le composant parent
            this.soumissionFinale.emit();

            // Afficher le popup avec le code de demande
            this.dialog.open(EnvoiCodeComponent, {
              width: '400px',
              disableClose: true,
              data: {
                codeDemande: response.codeDemande || this.demandesData.codeDemande
              }
            });

            // Réinitialiser l'état
            this.soumissionEnCours = false;
          },
          error: (error) => {
            console.error('Erreur lors de la soumission de la demande:', error);
            alert('Une erreur est survenue lors de la soumission de la demande. Veuillez réessayer.');
            this.soumissionEnCours = false;
          }
        });
      }
    });
  }
}


