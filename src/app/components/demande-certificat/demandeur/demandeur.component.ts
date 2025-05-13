/**
 * @description      :
 * @author           : ASUS
 * @group            :
 * @created          : 13/10/2024 - 14:24:07
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 13/10/2024
 * - Author          : ASUS
 * - Modification    :
 **/
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper'; // Ajout de CdkStepperModule
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-demandeur',
  standalone: true,
  templateUrl: './demandeur.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkStepperModule,
    ReactiveFormsModule,
    MatOptionModule,        // Ajout de l'import manquant
    MatFormFieldModule,     // Ajout de l'import manquant
    MatSelectModule,        // Ajout de l'import manquant
    MatInputModule
  ], // Ajout de CdkStepperModule
  styleUrls: ['./demandeur.component.css'],
})
export class DemandeurComponent implements OnInit {
  demandeurForm: FormGroup;
  typeDemandeur: string = '';


  @Output() demandeurEvent: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void { }

  @Output() typeDemandeChange = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    this.demandeurForm = this.fb.group({
      typeDemande: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mailPersonnePhysique: ['', [Validators.required, Validators.email]],
      dateNaissance: ['', Validators.required],
      genre: ['', Validators.required],
      nationalite: ['', Validators.required],
      telephone1PersonnePhysique: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      telephone2PersonnePhysique: ['', Validators.pattern('^[0-9]+$')], // Optionnel
      villeResidance: ['', Validators.required],
      typePiece: ['', Validators.required],
      numPiece: ['', Validators.required],
    });

    // Écoutez les changements sur le champ typeDemande
    this.demandeurForm.get('typeDemande')?.valueChanges.subscribe((value) => {
      this.typeDemandeChange.emit(value); // Émet la nouvelle valeur

    });
  }

  formValide: boolean = false;

  onSubmit(): void {
    if (this.demandeurForm.valid) {
      console.log('demandeurForm => ', this.demandeurForm);
      this.formValide = true; // Active le message de succès
      this.demandeurEvent.emit(this.demandeurForm.value);
      console.log('Formulaire valide, étape suivante');
    } else {
      this.formValide = false; // Désactive le message si formulaire invalide
      this.demandeurForm.markAllAsTouched(); // Marque tous les champs comme "touchés"
      console.log('Le formulaire est invalide');
    }
  }

  onTypeDemandeurChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.typeDemandeur = selectElement.value; // 'physique' ou 'morale'
  }
  // form = this.fb.group({
  //   typeDemande: [''], // 👈 valeur initiale vide
  //   // ... autres champs
  // });

}
