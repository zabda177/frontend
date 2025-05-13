/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 08/05/2025 - 01:59:33
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 08/05/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Composants
import { StepperComponent } from '../../../components/ui/stepper/stepper.component';
import { DemandeurComponent } from '../../../components/demande-certificat/demandeur/demandeur.component';
import { PersonneMoraleComponent } from '../../../components/demande-certificat/personne-morale/personne-morale.component';
import { FichierComponent } from '../../../components/demande-certificat/fichier/fichier.component';
import { FichierPermisComponent } from '../../../components/demande-certificat/fichier-permis/fichier-permis.component';
import { FichierGuideComponent } from '../../../components/demande-certificat/fichier-guide/fichier-guide.component';
import { FichierCommercialeComponent } from '../../../components/demande-certificat/fichier-commerciale/fichier-commerciale.component';
import { FichierConcessionComponent } from '../../../components/demande-certificat/fichier-concession/fichier-concession.component';
import { ResumeComponent } from '../resume/resume.component';

// Services
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';
import { PieceJointeService } from '../../../components/demande-certificat/service/piece-jointe.service';

@Component({
  selector: 'app-demande-agrement-custumer',
  templateUrl: './demande-agrement-customer.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    StepperComponent,
    CdkStepperModule,
    NgTemplateOutlet,
    DemandeurComponent,
    RouterModule,
    PersonneMoraleComponent,
    FichierComponent,
    FichierPermisComponent,
    FichierGuideComponent,
    FichierCommercialeComponent,
    FichierConcessionComponent,
    ResumeComponent,
    HttpClientModule
  ],
  providers: [
    DemandeServiceService,
    PieceJointeService
  ]
})
export class DemandeAgrementCustomerComponent implements OnInit {
  demandeurForm: FormGroup | undefined;
  personneMoraleForm: FormGroup | undefined;
  typeDemandeur: string = '';
  typeDemande: string = '';
  fichierData: any = null; // Modifié: permettre tout type de données
  demandeurData: any;
  demandesData: any = {}; // Initialisation avec un objet vide
  personneMoraleData: any;

  constructor(
    private pieceJointeService: PieceJointeService,
    private demandeServiceService: DemandeServiceService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Initialisation de base des données pour éviter l'erreur ExpressionChangedAfterItHasBeenCheckedError
    this.demandesData = {
      typeDemande: '',
      dateCreation: new Date().toISOString()
    };
    // Appliquer la détection de changements après initialisation
    this.cdr.detectChanges();
  }

  onTypeDemandeurChange(event: MatSelectChange) {
    this.typeDemandeur = event.value;
  }

  ontypeDemandeChange(typeDemande: string, data?: any) {
    this.typeDemande = typeDemande;

    // Mise à jour des données de la demande
    const newDemandesData = data || {
      typeDemande: typeDemande,
      dateCreation: new Date().toISOString()
    };

    // Utiliser setTimeout pour éviter l'erreur ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.demandesData = newDemandesData;
      console.log('Données de la demande reçues/initialisées:', this.demandesData);
      this.cdr.detectChanges();
    });
  }

  etablissementPersonneMoraleEvent(event: any) {
    this.personneMoraleData = event;
  }

  etablissementDemandeurEvent(event: any) {
    this.demandeurData = event;
  }

  permisPecheSubmitted(event: any) {
    this.fichierData = event;
  }

  guideSubmitted(event: any) {
    this.fichierData = event;
  }

  licenceCommercialleeSubmitted(event: any) {
    this.fichierData = event;
    console.log('Fichiers de licence commerciale reçus:', event);

    // Déplacer automatiquement à l'étape suivante (Résumé)
    // Si vous utilisez un ViewChild pour accéder au stepper, vous pourriez faire:
    // this.appStepper.next();

    // Notifier l'utilisateur que les fichiers ont été chargés avec succès
    // Vous pouvez ajouter un service de notification ici si vous en avez un
    setTimeout(() => {
      console.log('Prêt à passer à l\'étape Résumé');
    });
  }

  permisConcessionSubmitted(event: any) {
    this.fichierData = event;
  }

  fichierSubmitted(event: any) {
    this.fichierData = event;
  }

  etablissementfichierSubmitted(event: any) {
    this.fichierData = event;
  }

  demandesDataEvent(event: any) {
    setTimeout(() => {
      this.demandesData = event;
      console.log('Données de la demande :', event);
    });
  }

  onSubmit() {
    // Vérification de données nulles ou undefined avant de créer l'objet
    if (!this.typeDemandeur) {
      console.error("Type de demandeur non spécifié");
      return;
    }

    if (!this.typeDemande) {
      console.error("Type de demande non spécifié");
      return;
    }

    // Vérification des données du demandeur selon le type
    const demandeurData = this.typeDemandeur === 'morale' ? this.personneMoraleData : this.demandeurData;
    if (!demandeurData) {
      console.error(`Données du demandeur de type '${this.typeDemandeur}' manquantes`);
      return;
    }

    // Vérification des données de la demande
    if (!this.demandesData) {
      console.error("Les données de la demande sont manquantes");
      return;
    }

    // Préparation des données du demandeur (personne physique ou morale)
    let demandeur = {
      type: this.typeDemandeur,
      typeDemande: this.typeDemande,
      data: demandeurData
    };

    // Nettoyage des données pour éviter les valeurs undefined
    demandeur = this.cleanUndefinedValues(demandeur);
    const cleanedDemandesData = this.cleanUndefinedValues(this.demandesData);

    // Préparation des données de fichier selon leur type
    // Note: nous préservons le type original (FormData ou array)
    let fichierDataToSend: any;

    if (this.fichierData instanceof FormData) {
      // Si c'est un FormData, utiliser tel quel
      fichierDataToSend = this.fichierData;
    } else if (Array.isArray(this.fichierData)) {
      // Si c'est un tableau, nettoyer chaque élément
      fichierDataToSend = this.fichierData.map(fichier => this.cleanUndefinedValues(fichier));
    } else if (this.fichierData) {
      // Si c'est un autre type d'objet non null, le convertir en tableau
      fichierDataToSend = [this.cleanUndefinedValues(this.fichierData)];
    } else {
      // Si null ou undefined, initialiser un tableau vide
      fichierDataToSend = [];
    }

    console.log('Objet demandeur après nettoyage:', JSON.stringify(demandeur, null, 2));
    console.log('Données de la demande après nettoyage:', JSON.stringify(cleanedDemandesData, null, 2));
    console.log('Type de fichierDataToSend:',
      fichierDataToSend instanceof FormData
        ? 'FormData'
        : Array.isArray(fichierDataToSend)
          ? 'Array'
          : typeof fichierDataToSend);

    // Appeler la méthode qui envoie tout en une seule requête
    this.demandeServiceService.soumettreDemande(cleanedDemandesData, demandeur, fichierDataToSend)
      .subscribe({
        next: (response) => {
          console.log('Demande soumise avec succès:', response);
        },
        error: (error) => {
          console.error('Erreur lors de la soumission de la demande:', error);
        }
      });
  }

  // Méthode pour nettoyer les valeurs undefined
  private cleanUndefinedValues(obj: any): any {
    if (obj === null || obj === undefined) return null;

    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanUndefinedValues(item))
        .filter(item => item !== null && item !== undefined);
    }

    const cleaned: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== undefined) {
        cleaned[key] = this.cleanUndefinedValues(value);
      }
    });

    return cleaned;
  }

  // Ces méthodes sont conservées mais pourraient être supprimées si elles ne sont pas utilisées
  envoyerDemande(demandeurId: number) {
    if (this.demandesData) {
      const demandeData = {
        ...this.demandesData,
        demandeurId: demandeurId
      };

      this.demandeServiceService.envoyerDonneesDemande(demandeData)
        .subscribe({
          next: (response) => {
            console.log('Données de la demande envoyées avec succès:', response);
            const demandeId = response.id;
            this.envoyerPiecesJointes(demandeId);
          },
          error: (error) => {
            console.error('Erreur lors de l\'envoi des données de la demande:', error);
          }
        });
    }
  }

  envoyerPiecesJointes(demandeId: number) {
    if (this.fichierData) {
      if (this.fichierData instanceof FormData) {
        this.pieceJointeService.envoyerPiecesJointes(this.fichierData, demandeId)
          .subscribe({
            next: (response) => {
              console.log('Pièces jointes envoyées avec succès:', response);
            },
            error: (error) => {
              console.error('Erreur lors de l\'envoi des pièces jointes:', error);
            }
          });
      } else if (Array.isArray(this.fichierData)) {
        // Ajout d'une vérification supplémentaire pour s'assurer que c'est un tableau
        this.pieceJointeService.envoyerFichiersDemande(demandeId, this.fichierData)
          .subscribe({
            next: (response) => {
              console.log('Fichiers de la demande envoyés avec succès:', response);
            },
            error: (error) => {
              console.error('Erreur lors de l\'envoi des fichiers:', error);
            }
          });
      } else {
        console.error('Le format des fichiers n\'est pas reconnu');
      }
    }
  }
}
