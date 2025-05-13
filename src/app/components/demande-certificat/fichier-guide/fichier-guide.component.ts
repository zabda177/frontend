/**
 * @description      : Composant pour gérer les fichiers de licence guide
 * @author           : ASUS
 * @group            :
 * @created          : 04/10/2024 - 18:16:31
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 04/10/2024
 * - Author          : ASUS
 * - Modification    :
 **/
import { CdkStepper, CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, Optional, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-fichier-guide',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CdkStepperNext,
    CdkStepperPrevious,
    ReactiveFormsModule,
  ],
  templateUrl: './fichier-guide.component.html',
  styleUrl: './fichier-guide.component.css',
})
export class FichierGuideComponent {
  fichierForm!: FormGroup;
  formValide: boolean = true;
  typeFichier: string = '';
  isLoading: boolean = false;
  validationMessages: string[] = [];

  // Accès au stepper parent pour naviguer programmatiquement
  // Nous utilisons l'injection de dépendance pour accéder au stepper parent
  @ViewChild(CdkStepper) viewChildStepper!: CdkStepper;

  demandeFile: File | null = null;
  cnibFile: File | null = null;
  reconnaissanceFile: File | null = null;
  certificatNationaliteFile: File | null = null;
  listeEquipementFile: File | null = null;
  photoFile: File | null = null;
  quittanceFile: File | null = null;

  @Output() LicenceGuideSubmitted = new EventEmitter<FormData>();

  constructor(@Optional() private parentStepper: CdkStepper) { }

  validateFiles(): boolean {
    this.validationMessages = [];

    if (!this.demandeFile) {
      this.validationMessages.push('Veuillez charger la demande timbrée');
    }
    if (!this.cnibFile) {
      this.validationMessages.push('Veuillez charger le document d\'identité (CNIB)');
    }
    if (!this.certificatNationaliteFile) {
      this.validationMessages.push('Veuillez charger le certificat de Nationalité');
    }
    if (!this.reconnaissanceFile) {
      this.validationMessages.push('Veuillez charger le document de personne morale');
    }
    if (!this.listeEquipementFile) {
      this.validationMessages.push('Veuillez charger la liste des équipements');
    }
    if (!this.photoFile) {
      this.validationMessages.push('Veuillez charger la photo d\'identité');
    }
    if (!this.quittanceFile) {
      this.validationMessages.push('Veuillez charger la quittance de versement');
    }

    return this.validationMessages.length === 0;
  }

  onFileSave(event?: Event) {
    // Empêcher la soumission du formulaire par défaut
    if (event) {
      event.preventDefault();
    }

    // Valider les fichiers
    if (!this.validateFiles()) {
      // Afficher le premier message d'erreur
      if (this.validationMessages.length > 0) {
        alert(this.validationMessages[0]);
      }
      return;
    }

    this.isLoading = true;

    // Créer et remplir FormData
    const formData = new FormData();

    if (this.demandeFile) formData.append('demande', this.demandeFile);
    if (this.cnibFile) formData.append('cnib', this.cnibFile);
    if (this.reconnaissanceFile) formData.append('reconnaissance', this.reconnaissanceFile);
    if (this.certificatNationaliteFile) formData.append('certificatNationalite', this.certificatNationaliteFile);
    if (this.listeEquipementFile) formData.append('listeEquipement', this.listeEquipementFile);
    if (this.photoFile) formData.append('photo', this.photoFile);
    if (this.quittanceFile) formData.append('quittance', this.quittanceFile);

    // Émettre l'événement avec les données de formulaire
    this.LicenceGuideSubmitted.emit(formData);

    // Attendre un peu pour simuler le chargement et permettre à l'émission d'événement de se terminer
    setTimeout(() => {
      this.isLoading = false;

      // Essayer d'accéder au stepper parent de différentes manières
      const stepper = this.parentStepper || this.viewChildStepper;

      if (stepper) {
        // Utiliser le stepper si disponible
        stepper.next();
      } else {
        // Si aucun stepper n'est accessible, chercher le stepper dans le DOM
        this.navigateToNextStepManually();
      }
    }, 500);
  }

  // Méthode pour naviguer manuellement vers l'étape suivante si le stepper n'est pas accessible par injection
  private navigateToNextStepManually() {
    try {
      // Trouver l'élément du stepper dans le DOM
      const stepperElement = document.querySelector('app-stepper');
      if (stepperElement) {
        // Trouver le bouton "suivant" du stepper et simuler un clic
        const nextButtonInStepper = stepperElement.querySelector('.cdk-stepper-next') as HTMLButtonElement;
        if (nextButtonInStepper) {
          nextButtonInStepper.click();
          return;
        }
      }

      // Comme solution de secours, chercher directement le bouton avec la classe cdkStepperNext
      const nextButtons = document.querySelectorAll('.btn-success[cdkStepperNext], button[cdkStepperNext]');
      if (nextButtons.length > 0) {
        // Cliquer sur le premier bouton trouvé
        (nextButtons[0] as HTMLButtonElement).click();
        return;
      }

      console.warn('Navigation au stepper suivant: Impossible de trouver un élément pour naviguer. Veuillez cliquer manuellement sur Suivant.');
    } catch (error) {
      console.error('Erreur lors de la navigation manuelle au stepper suivant:', error);
    }
  }

  onTypeDemandeurChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.typeFichier = selectElement.value;
  }

  onFileSelect(event: any, field: string) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    if (file) {
      switch (field) {
        case 'demande':
          this.demandeFile = file;
          break;
        case 'cnib':
          this.cnibFile = file;
          break;
        case 'reconnaissance':
          this.reconnaissanceFile = file;
          break;
        case 'certificatNationalite':
          this.certificatNationaliteFile = file;
          break;
        case 'listeEquipement':
          this.listeEquipementFile = file;
          break;
        case 'photo':
          this.photoFile = file;
          break;
        case 'quittance':
          this.quittanceFile = file;
          break;
      }
    }
  }
}
