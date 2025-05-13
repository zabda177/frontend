import { CommonModule } from '@angular/common';
/**
 * @description      :
 * @author           : ASUS
 * @group            :
 * @created          : 06/10/2024 - 17:11:37
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 06/10/2024
 * - Author          : ASUS
 * - Modification    :
 **/
import { CdkStepperModule, CdkStepperNext } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-personne-morale',
  standalone: true,
  imports: [
    CdkStepperNext,
    ReactiveFormsModule,
    CommonModule,
    CdkStepperModule,
  ],
  templateUrl: './personne-morale.component.html',
  styleUrl: './personne-morale.component.css',
})
export class PersonneMoraleComponent {
  personneMoraleForm!: FormGroup;
  typePersonneMorale: string = '';

  @Output() personneMoraleEvent: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void { }

  @Output() typeDemandeChange = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    this.personneMoraleForm = this.fb.group({
      ifu: [''],
      typeDemande: [''],
      denomination: [''],
      nomResponsable: [''],
      prenomResponsable: [''],
      siege: [''],
      mailPersonneMorale: [''],
      telephone1PersonneMorale: [''],
      telephone2PersonneMorale: [''],
    });

    // Écoutez les changements sur le champ typeDemande
    this.personneMoraleForm
      .get('typeDemande')
      ?.valueChanges.subscribe((value) => {
        this.typeDemandeChange.emit(value); // Émet la nouvelle valeur
      });
  }

  formValide: boolean = false;
  onSubmit(): void {
    if (this.personneMoraleForm.valid) {
      this.formValide = true; // Active le message de succès
      this.personneMoraleEvent.emit(this.personneMoraleForm.value);
    } else {
      this.formValide = false; // Désactive le message si formulaire invalide
      this.personneMoraleForm.markAllAsTouched(); // Marque tous les champs comme "touchés"
      console.log('Le formulaire est invalide');
    }
  }

  onTypePersonneMoraleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.typePersonneMorale = selectElement.value; // 'physique' ou 'morale'
  }
}
