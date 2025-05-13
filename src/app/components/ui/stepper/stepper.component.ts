/**
 * @description      :
 * @author           : ASUS
 * @group            :
 * @created          : 11/10/2024 - 20:55:07
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 11/10/2024
 * - Author          : ASUS
 * - Modification    :
 **/
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  standalone: true,
  imports: [NgTemplateOutlet, NgIf, NgForOf],
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
})
export class StepperComponent extends CdkStepper {
  @Input() linearModeSelected = true;

  onClick(index: number): void {
    this.selectedIndex = index; // Changement d'étape lorsqu'un bouton est cliqué
  }
}
