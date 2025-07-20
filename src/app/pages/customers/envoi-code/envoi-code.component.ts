/**
    * @description      : Composant d'envoi de code avec fond et navigation vers l'accueil
    * @author           : ASUS
    * @group            :
    * @created          : 08/05/2025 - 22:30:43
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 08/05/2025
    * - Author          : ASUS
    * - Modification    : Ajout de la navigation vers la page d'accueil
**/
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-envoi-code',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Information importante</h2>
      <mat-dialog-content>
        <div class="message-container">
          <p>Veuillez noter le code de la demande pour le suivi :</p>
          <div class="code-container">
            <span class="code">{{ data.codeDemande }}</span>
            <button mat-icon-button [cdkCopyToClipboard]="data.codeDemande" matTooltip="Copier le code">
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button color="primary" (click)="retourAccueil()"> OK </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      background-color: rgb(232, 237, 234);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }
    h2 {
      margin-top: 0;
      font-weight: 500;
      color: #303f9f;
    }
    .message-container {
      text-align: center;
    }
    .code-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0;
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #3f51b5;
      padding: 8px 16px;
      border: 1px dashed #3f51b5;
      border-radius: 4px;
      margin-right: 8px;
      background-color: rgba(63, 81, 181, 0.05);
    }
  `]
})
export class EnvoiCodeComponent {
  constructor(
    public dialogRef: MatDialogRef<EnvoiCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      codeDemande: string;
    },
    private router: Router
  ) { }

  /**
   * Ferme le dialogue et navigue vers la page d'accueil
   */
  retourAccueil(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/']);
  }
}






