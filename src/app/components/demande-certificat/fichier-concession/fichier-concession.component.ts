/**
 * @description      : Composant de gestion des fichiers de concession
 * @author           : ASUS
 * @group            :
 * @created          : 05/10/2024 - 04:56:33
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 05/10/2024
 * - Author          : ASUS
 * - Modification    :
 **/
import { CdkStepper, CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Component, EventEmitter, Inject, Optional, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-fichier-concession',
  standalone: true,
  imports: [
    CdkStepperNext,
    CdkStepperPrevious,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fichier-concession.component.html',
  styleUrl: './fichier-concession.component.css',
})
export class FichierConcessionComponent {
  fichierForm!: FormGroup;
  formValide: boolean = true;
  typeFichier: string = '';

  demandeFile: File | null = null;
  cnibFile: File | null = null;
  reconnaissanceFile: File | null = null;
  listeMembreFile: File | null = null;
  engagementFile: File | null = null;
  photoFile: File | null = null;
  quittanceFile: File | null = null;

  @Output() permisConcessionSubmitted = new EventEmitter<FormData>();

  constructor(@Optional() private stepper: CdkStepper) { }

  onFileSave() {
    // Validation des fichiers
    if (this.demandeFile == null) {
      alert('Veuillez renseigné la demande');
      return;
    } else if (this.cnibFile == null) {
      alert('Veuillez charger la CNIB');
      return;
    } else if (this.reconnaissanceFile == null) {
      alert('Veuillez chargée le document de reconnaisance');
      return;
    } else if (this.listeMembreFile == null) {
      alert('Veuillez chargée la liste des membres');
      return;
    } else if (this.engagementFile == null) {
      alert('Veuillez chargée lengagement');
      return;
    } else if (this.photoFile == null) {
      alert('Veuillez charger la photo');
      return;
    } else if (this.quittanceFile == null) {
      alert('Veuillez charger la quittance___');
      return;
    }

    const formData = new FormData();
    formData.append('demande', this.demandeFile);
    formData.append('cnib', this.cnibFile);
    formData.append('reconnaissance', this.reconnaissanceFile);
    formData.append('listeMembre', this.listeMembreFile);
    formData.append('engagement', this.engagementFile);
    formData.append('photo', this.photoFile);
    formData.append('quittance', this.quittanceFile);

    // Émettre les données vers le composant parent
    this.permisConcessionSubmitted.emit(formData);

    // Attendre un peu pour que le parent traite les données
    // puis naviguer automatiquement à l'étape suivante
    if (this.stepper) {
      setTimeout(() => {
        this.stepper.next();
      }, 100);
    }
  }

  onTypeDemandeurChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.typeFichier = selectElement.value; // 'physique' ou 'morale'
  }

  onFileSelect(event: any, field: string) {
    const file = event.target.files[0]; // Corrigé pour éviter une erreur de sélection de fichier
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
        case 'listeMembre':
          this.listeMembreFile = file;
          break;
        case 'engagement':
          this.engagementFile = file;
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


