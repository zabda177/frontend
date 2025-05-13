/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 08/05/2025 - 17:58:04
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 08/05/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-fichier-permis',
  standalone: true,
  imports: [
    CdkStepperNext,
    CdkStepperPrevious,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fichier-permis.component.html',
  styleUrl: './fichier-permis.component.css',
})
export class FichierPermisComponent {
  fichierForm!: FormGroup;
  formValide: boolean = true;
  typeFichier: string = '';
  demandeFile: File | null = null;
  cnibFile: File | null = null;
  certificatNationaliteFile: File | null = null;
  listeMembreFile: File | null = null;
  photoFile: File | null = null;
  quittanceFile: File | null = null;
  @Output() permisPecheSubmitted: EventEmitter<any> = new EventEmitter<any>();
  // Référence au bouton next du stepper
  @ViewChild('nextButton') nextButton!: ElementRef<HTMLButtonElement>;
  constructor() { }
  onFileSave(event: Event) {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();
    if (this.validateFiles()) {
      // Création d'un FormData pour être compatible avec le composant parent
      const formData = new FormData();

      // Ajout des fichiers au FormData avec des clés descriptives
      if (this.demandeFile) formData.append('demande', this.demandeFile, this.demandeFile.name);
      if (this.cnibFile) formData.append('cnib', this.cnibFile, this.cnibFile.name);
      if (this.certificatNationaliteFile) formData.append('certificatNationalite', this.certificatNationaliteFile, this.certificatNationaliteFile.name);
      if (this.photoFile) formData.append('photo', this.photoFile, this.photoFile.name);
      if (this.quittanceFile) formData.append('quittance', this.quittanceFile, this.quittanceFile.name);

      // Ajout de métadonnées pour aider le backend à identifier le type de fichiers
      formData.append('typeDemande', 'permisPeche');

      // Émettre l'événement avec le FormData
      this.permisPecheSubmitted.emit(formData);

      // Log pour confirmer l'émission
      console.log('FormData de fichiers créé et envoyé');

      // Passer à l'étape suivante en cliquant programmatiquement sur le bouton next
      setTimeout(() => {
        if (this.nextButton) {
          this.nextButton.nativeElement.click();
        }
      });
    }
  }
  // Méthode pour valider tous les fichiers en une seule fonction
  validateFiles(): boolean {
    if (!this.demandeFile) {
      alert('Veuillez charger votre demande manuscrite');
      return false;
    }
    if (!this.cnibFile) {
      alert('Veuillez charger votre Document d\'Identité');
      return false;
    }
    if (!this.certificatNationaliteFile) {
      alert('Veuillez charger votre Certificat de Nationalité');
      return false;
    }
    if (!this.photoFile) {
      alert('Veuillez charger votre Photo');
      return false;
    }
    if (!this.quittanceFile) {
      alert('Veuillez charger votre Quittance de versement');
      return false;
    }
    return true;
  }
  onTypeDemandeurChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.typeFichier = selectElement.value; // 'physique' ou 'morale'
  }
  onFileSelect(event: any, field: string) {
    console.log('event => ', event);
    const file = event.target.files[0]; // Corrigé pour éviter une erreur de sélection de fichier
    if (file) {
      switch (field) {
        case 'demande':
          this.demandeFile = file;
          break;
        case 'cnib':
          this.cnibFile = file;
          break;
        case 'certificatNationalite':
          this.certificatNationaliteFile = file;
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
