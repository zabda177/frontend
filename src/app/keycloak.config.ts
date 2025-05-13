/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 24/12/2024 - 14:36:17
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/12/2024
    * - Author          : ASUS
    * - Modification    :
**/
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class KeycloakInitService {

  constructor(private keycloakService: KeycloakService) { }

  async init() {
    try {
      await this.keycloakService.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'gestion_attribution_peche', // Replace with your Keycloak realm
          clientId: 'peche', // Replace with your Keycloak client ID
        },
        initOptions: {
          onLoad: 'login-required',  // Adjust according to your app's needs (login-required, check-sso, etc.)
          checkLoginIframe: false,
        },
      });
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  }
}
