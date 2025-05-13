/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 24/12/2024 - 14:54:16
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/12/2024
    * - Author          : ASUS
    * - Modification    :
**/
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
