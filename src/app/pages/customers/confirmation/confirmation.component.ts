/**
    * @description      : Composant de confirmation avec fond
    * @author           : ASUS
    * @group            :
    * @created          : 08/05/2025 - 22:30:43
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 08/05/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button [mat-dialog-close]="false">{{ data.cancelButton }}</button>
        <button mat-button color="primary" [mat-dialog-close]="true">{{ data.confirmButton }}</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      background-color:rgb(184, 208, 187);
      padding: 16px;
      border-radius: 8px;
    }
    h2 {
      margin-top: 0;
      font-weight: 500;
      color: #333;
    }
    mat-dialog-content {
      margin-bottom: 16px;
      color: #555;
    }
    mat-dialog-actions {
      margin-bottom: 0;
    }
  `]
})
export class ConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmButton: string;
      cancelButton: string;
    }
  ) { }
}






// /**
//     * @description      :
//     * @author           : ASUS
//     * @group            :
//     * @created          : 08/05/2025 - 22:30:43
//     *
//     * MODIFICATION LOG
//     * - Version         : 1.0.0
//     * - Date            : 08/05/2025
//     * - Author          : ASUS
//     * - Modification    :
// **/
// import { Component, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-confirmation-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatDialogModule,
//     MatButtonModule
//   ],
//   template: `
//     <h2 mat-dialog-title>{{ data.title }}</h2>
//     <mat-dialog-content>
//       <p>{{ data.message }}</p>
//     </mat-dialog-content>
//     <mat-dialog-actions align="end">
//       <button mat-button [mat-dialog-close]="false">{{ data.cancelButton }}</button>
//       <button mat-button color="primary" [mat-dialog-close]="true">{{ data.confirmButton }}</button>
//     </mat-dialog-actions>
//   `,
//   styles: [`
//     h2 {
//       margin-top: 0;
//       font-weight: 500;
//     }
//     mat-dialog-content {
//       margin-bottom: 16px;
//     }
//   `]
// })
// export class ConfirmationComponent {
//   constructor(
//     public dialogRef: MatDialogRef<ConfirmationComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: {
//       title: string;
//       message: string;
//       confirmButton: string;
//       cancelButton: string;
//     }
//   ) { }
// }








