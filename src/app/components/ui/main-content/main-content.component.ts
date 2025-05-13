/**
 * @description      :
 * @author           : ASUS
 * @group            :
 * @created          : 05/10/2024 - 06:58:28
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 05/10/2024
 * - Author          : ASUS
 * - Modification    :
 **/
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
})
export class MainContentComponent {
  router: Router = inject(Router);

  // Méthode appelée lors du clic sur le bouton
  formulaireDemande() {
    this.router.navigate(['/customer/demandes']);
  }
  verification() {
    this.router.navigate(['/customer/verification']);
  }
  formulaireGuide() {
    this.router.navigate(['/guide']);
  }
  forrmulaireCommeerciale() {
    this.router.navigate(['/commerciale']);
  }
  formulaireAgrement() {
    this.router.navigate(['/agrement']);
  }
}
