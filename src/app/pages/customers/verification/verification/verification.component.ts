/**
 * @description      : Composant de vérification des demandes
 * @author           : ASUS (modifié)
 * @group            :
 * @created          : 01/05/2025 - 01:19:25
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 01/05/2025
 * - Author          : ASUS
 * - Modification    :
 **/
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeServiceService } from './../../../../components/demande-certificat/service/demande-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

interface DemandeResponse {
  numeroDemande: string;
  codeDemande: string;
  status: string;
  step?: number;
  piece?: any[];
}

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css',
  providers: [HttpClientModule, DemandeServiceService],
})
export class VerificationComponent implements OnInit {
  // Variables pour le modal
  isModalOpen: boolean = false;
  codeInput: string = '';
  error: string = '';
  loading: boolean = false;

  // Variables pour la demande
  demandeSoumise: DemandeResponse | null = null;
  piece: any[] = [];
  currentStep: number = 1; // Initialiser avec l'étape 1 (Demande soumise)

  // Service
  demandeServiceService: DemandeServiceService = inject(DemandeServiceService);

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Vérifie si des paramètres sont fournis dans l'URL
    const codeDemande = this.route.snapshot.queryParamMap.get('codeDemande');
    if (codeDemande) {
      this.codeInput = codeDemande;
      this.handleVerification();
    } else {
      // Si aucun code n'est fourni, on ouvre automatiquement le modal
      this.openModal();
    }
  }

  // Ouvre le modal
  openModal(): void {
    this.isModalOpen = true;
    this.error = '';
    this.codeInput = '';
  }

  // Ferme le modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Ferme le modal et redirige vers la page d'accueil
  closeModalWithRedirect(): void {
    this.isModalOpen = false;
    this.router.navigate(['']);
  }

  // Gère la vérification du code
  handleVerification(): void {
    if (!this.codeInput) {
      this.error = 'Veuillez saisir le code de demande';
      return;
    }

    this.loading = true;

    // Appel au service pour vérifier la demande
    this.demandeServiceService.getDemandeDetailsByCode(this.codeInput)
      .subscribe({
        next: (response: any) => {
          this.demandeSoumise = response;

          // Si la step est -1 (rejetée), conserver cette valeur
          // Sinon, s'assurer qu'on a au moins l'étape 1 (Demande soumise)
          this.currentStep = response.step || 1;

          // Si la step est 0 ou non définie, la mettre à 1 (Demande soumise)
          if (this.currentStep === 0) {
            this.currentStep = 1;
          }

          // Récupérer les pièces si disponibles
          if (this.demandeSoumise) {
            this.piece = this.demandeSoumise.piece || [];
          }

          this.loading = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de la vérification de la demande', error);
          this.error = 'Code de demande invalide ou erreur système';
          this.loading = false;
        }
      });
  }

  // Vérifie si la demande est rejetée
  isRejected(): boolean {
    return this.currentStep === -1;
  }

  // Obtenir le libellé du statut en fonction de l'étape
  getStatusLabel(step: number): string {
    switch (step) {
      case 1: return 'Votre Demande a bien été Soumise';
      case 2: return 'Demande Acceptée pour Traitement';
      case 3: return 'Demande Validée par le Sous Comité';
      case -1: return 'Demande Rejetée';
      default: return 'État Inconnu';
    }
  }

  // Méthode sécurisée pour récupérer la valeur de l'étape
  getStepValue(): number {
    return this.currentStep || 1;
  }
}
