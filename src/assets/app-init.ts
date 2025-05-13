/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 24/12/2024 - 14:49:56
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/12/2024
    * - Author          : ASUS
    * - Modification    :
**/
import { KeycloakService } from 'keycloak-angular';


export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      initOptions: {
        onLoad: 'login-required',
      },
      enableBearerInterceptor: true,
      bearerExcludedUrls: ['/assets'],
    });
}
