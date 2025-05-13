/**
 * @description      : Header Component
 * @author           : ASUS
 * @group            :
 * @created          : 11/12/2024 - 19:18:41
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 11/12/2024
 * - Author          : ASUS
 * - Modification    :
**/
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  title = 'keycloak-angular-example';
  isAuthenticated = false;

  constructor(
    public keycloakService: KeycloakService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    // Souscrire aux événements Keycloak
    this.keycloakService.keycloakEvents$.subscribe({
      next: (event) => {
        if (event.type == KeycloakEventType.OnTokenExpired) {
          this.keycloakService.updateToken(20);
        }
        if (event.type == KeycloakEventType.OnAuthSuccess) {
          // Navigation après connexion réussie
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  async ngOnInit() {
    // Vérifier si l'utilisateur est déjà authentifié au chargement
    this.isAuthenticated = await this.keycloakService.isLoggedIn();
  }

  public login(): void {
    // Spécifier l'URL de redirection après connexion
    this.keycloakService.login({
      redirectUri: window.location.origin + '/dashboard'
    });
  }

  logout() {
    // Rediriger vers la page d'accueil après déconnexion
    this.keycloakService.logout(window.location.origin + '/customer/home');
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  public isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}




