/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 24/12/2024 - 15:22:35
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/12/2024
    * - Author          : ASUS
    * - Modification    :
**/
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { KeycloakService } from 'keycloak-angular';
import { PLATFORM_ID } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

function initializeKeycloak(keycloak: KeycloakService) {
  return () => {
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    if (isBrowser) {
      return keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'gestion_attribution_peche',
          clientId: 'peche',
        },
        initOptions: {
          onLoad: 'check-sso', // 'login-required' or 'check-sso'
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        },
        enableBearerInterceptor: true,
      });
    } else {
      // Handle SSR (server-side rendering) if needed
      return Promise.resolve();
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  // Set up the router with defined routes
    provideHttpClient(withFetch()),  // Enable fetch for HTTP requests
    provideAnimations(), // Nécessaire pour les animations de Toastr
    provideToastr({      // Configuration globale de Toastr
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID],  // Inject PLATFORM_ID to check the platform
    },
    KeycloakService  // Ensure Keycloak service is available throughout the app
  ]

};
