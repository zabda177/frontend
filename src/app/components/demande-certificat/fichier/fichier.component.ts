/**
 * @description      :
 * @author           : ASUS
 * @group            :
 * @created          : 05/10/2024 - 04:43:36
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 05/10/2024
 * - Author          : ASUS
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
  selector: 'app-fichier',
  standalone: true,
  imports: [
    CdkStepperNext,
    CdkStepperPrevious,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './fichier.component.html',
  styleUrl: './fichier.component.css',
})
export class FichierComponent {
  fichierForm!: FormGroup;
  formValide: boolean = true;
  typeFichier: string = '';

  demandeFile: File | null = null;
  cnibFile: File | null = null;
  reconnaissanceFile: File | null = null;
  infrastructureFile: File | null = null;
  avisFile: File | null = null;
  titreTerrainFile: File | null = null;
  planEtablissementFile: File | null = null;
  quittanceFile: File | null = null;

  @Output() fichierSubmitted: EventEmitter<FormData> = new EventEmitter<FormData>();

  constructor() { }

  onFileSave() {
    // Vérification de chaque fichier avec un message d'erreur amélioré
    if (this.demandeFile == null) {
      alert('Veuillez charger votre demande manuscrite');
      return;
    } else if (this.cnibFile == null) {
      alert('Veuillez charger la CNIB');
      return;
    } else if (this.reconnaissanceFile == null) {
      alert('Veuillez charger le fichier de reconnaissance');
      return;
    } else if (this.infrastructureFile == null) {
      alert('Veuillez charger la liste du matériel');
      return;
    } else if (this.avisFile == null) {
      alert('Veuillez charger l\'avis environnemental');
      return;
    } else if (this.titreTerrainFile == null) {
      alert('Veuillez charger le titre du terrain');
      return;
    } else if (this.planEtablissementFile == null) {
      alert('Veuillez charger le plan du terrain');
      return;
    } else if (this.quittanceFile == null) {
      alert('Veuillez charger la quittance');
      return;
    }

    const formData = new FormData();

    // Ajout de chaque fichier au FormData, avec vérification de l'existence
    if (this.demandeFile) {
      formData.append('demande', this.demandeFile);
    }

    if (this.cnibFile) {
      formData.append('cnib', this.cnibFile);
    }

    if (this.reconnaissanceFile) {
      formData.append('reconnaissance', this.reconnaissanceFile);
    }

    if (this.infrastructureFile) {
      formData.append('infrastructure', this.infrastructureFile);
    }

    if (this.titreTerrainFile) {
      formData.append('titreTerrain', this.titreTerrainFile);
    }

    if (this.planEtablissementFile) {
      formData.append('planEtablissement', this.planEtablissementFile);
    }

    if (this.avisFile) {
      formData.append('avis', this.avisFile);
    }

    if (this.quittanceFile) {
      formData.append('quittance', this.quittanceFile);
    }

    // Ajout d'un indicateur pour faciliter la vérification du type côté parent
    formData.append('_type', 'formData');

    // Émettre le formData vers le composant parent
    this.fichierSubmitted.emit(formData);
  }

  onTypeDemandeurChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.typeFichier = selectElement.value; // 'physique' ou 'morale'
  }

  onFileSelect(event: any, field: string) {
    const file = event.target.files[0]; // Corrigé pour éviter une erreur de sélection de fichier
    if (!file) {
      console.warn(`Aucun fichier sélectionné pour le champ ${field}`);
      return;
    }

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
      case 'infrastructure':
        this.infrastructureFile = file;
        break;
      case 'titreTerrain':
        this.titreTerrainFile = file;
        break;
      case 'planEtablissement':
        this.planEtablissementFile = file;
        break;
      case 'avis':
        this.avisFile = file;
        break;
      case 'quittance':
        this.quittanceFile = file;
        break;
      default:
        console.warn(`Champ de fichier non reconnu: ${field}`);
    }
  }
}



