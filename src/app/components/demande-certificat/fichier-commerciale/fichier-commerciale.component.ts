/**
 * @description      : Composant pour la gestion des fichiers de licence commerciale
 * @author           : Claude
 * @group            :
 * @created          : 08/05/2025
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 08/05/2025
 * - Author          : Claude
 * - Modification    :
 **/
import { Component, EventEmitter, Output } from '@angular/core';
import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fichier-commerciale',
  standalone: true,
  imports: [
    CdkStepperNext,
    CdkStepperPrevious,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './fichier-commerciale.component.html',
  styleUrl: './fichier-commerciale.component.css',
})
export class FichierCommercialeComponent {
  fichierForm!: FormGroup;
  formValide: boolean = true;

  demandeFile: File | null = null;
  cnibFile: File | null = null;
  rapportActiviteFile: File | null = null;
  impotFile: File | null = null;
  attestationFormationFile: File | null = null;
  planAffaireFile: File | null = null;
  quittanceFile: File | null = null;

  @Output() licenceCommercialleSubmitted: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onFileSave() {
    // Validation des fichiers requis
    if (this.demandeFile == null) {
      alert('Veuillez charger la Demande manuscrite');
      return;
    } else if (this.cnibFile == null) {
      alert('Veuillez charger le Document d\'Identité');
      return;
    } else if (this.rapportActiviteFile == null) {
      alert('Veuillez charger le Rapport d\'activité');
      return;
    } else if (this.impotFile == null) {
      alert('Veuillez charger l\'Attestation fiscale');
      return;
    } else if (this.attestationFormationFile == null) {
      alert('Veuillez charger l\'Attestation de formation');
      return;
    } else if (this.planAffaireFile == null) {
      alert('Veuillez charger le Plan d\'affaire');
      return;
    } else if (this.quittanceFile == null) {
      alert('Veuillez charger la Quittance de versement');
      return;
    }

    // Préparation des données à envoyer
    const formData = new FormData();

    formData.append('demande', this.demandeFile);
    formData.append('cnib', this.cnibFile);
    formData.append('rapportActivite', this.rapportActiviteFile);
    formData.append('impot', this.impotFile);
    formData.append('attestationFormation', this.attestationFormationFile);
    formData.append('planAffaire', this.planAffaireFile);
    formData.append('quittance', this.quittanceFile);

    // Émission de l'événement avec les données de formulaire vers le composant parent
    this.licenceCommercialleSubmitted.emit(formData);
  }

  onFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      switch (field) {
        case 'demande':
          this.demandeFile = file;
          break;
        case 'cnib':
          this.cnibFile = file;
          break;
        case 'rapportActivite':
          this.rapportActiviteFile = file;
          break;
        case 'impot':
          this.impotFile = file;
          break;
        case 'attestationFormation':
          this.attestationFormationFile = file;
          break;
        case 'planAffaire':
          this.planAffaireFile = file;
          break;
        case 'quittance':
          this.quittanceFile = file;
          break;
      }
    }
  }
}


