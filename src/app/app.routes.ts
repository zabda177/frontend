//import { ResumeComponent } from './pages/customers/resume/resume.component';

/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 23/04/2025 - 16:42:05
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/04/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { DemandeAgrementCustomerComponent } from './pages/customers/demande-agrement-customer/demande-agrement-customer.component';
import { FichierPermisComponent } from './components/demande-certificat/fichier-permis/fichier-permis.component';

import { Routes } from '@angular/router';
import { AdminRoute } from './pages/admin/admin.route';
import { CustomerRoute } from './pages/customers/customer.route';

import { FichierConcessionComponent } from './components/demande-certificat/fichier-concession/fichier-concession.component';

import { FichierGuideComponent } from './components/demande-certificat/fichier-guide/fichier-guide.component';

import { FichierCommercialeComponent } from './components/demande-certificat/fichier-commerciale/fichier-commerciale.component';
import { VerificationComponent } from './pages/customers/verification/verification/verification.component';

import { DashboardComponent } from './pages/customers/dashboard/dashboard.component';
import { HttpClient } from '@angular/common/http';

import { MenuComponent } from './components/ui/menu/menu.component';

import { Component } from '@angular/core';
import { DemandeSoumiseComponent } from './pages/customers/demande-soumise/demande-soumise.component';
import { DemandesAccepteesComponent } from './pages/customers/demandes-acceptees/demandes-acceptees.component';
import { DemandesValideesComponent } from './pages/customers/demandes-validees/demandes-validees.component';
import { DemandesRejeteComponent } from './pages/customers/demandes-rejete/demandes-rejete.component';
import { DetailsComponent } from './pages/customers/details/details.component';
import { LoginComponent } from './pages/login/login.component';
import { GuideComponent } from './pages/customers/guide/guide.component';
import { FaqComponent } from './pages/customers/faq/faq.component';
import { ResumeComponent } from './pages/customers/resume/resume.component';
import { DetailsDemandeComponent } from './pages/customers/details-demande/details-demande.component';




export const routes: Routes = [

  {
    path: 'detailsDemande/:id', component: DetailsDemandeComponent
  },

  {
    path: 'resume/:id', component: ResumeComponent,
  },

  {
    path: 'guide', component: GuideComponent,
  },

  {
    path: 'faq',
    component: FaqComponent,
  },


  {
    path: 'details/:id',
    component: DetailsComponent,
  },
  {
    path: 'demandeRejete',
    component: DemandesRejeteComponent,
  },


  {
    path: 'demandesValide',
    component: DemandesValideesComponent,
  },
  {
    path: 'demandeesAcceptees',
    component: DemandesAccepteesComponent,
  },

  {
    path: 'demandeSoumise',
    component: DemandeSoumiseComponent,
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'fichierGuide',
    component: FichierGuideComponent,
  },


  {
    path: 'fichierCommerciale',
    component: FichierCommercialeComponent,
  },

  {
    path: 'permis',
    component: FichierPermisComponent,
  },
  {
    path: 'fichierConcesssion',
    component: FichierConcessionComponent,
  },

  {
    path: 'verification',
    component: VerificationComponent,
  },
  {
    path: 'demandes',
    component: DemandeAgrementCustomerComponent,
  },

  {
    path: 'admin',
    children: AdminRoute,
  },
  {
    path: 'customer',
    children: CustomerRoute,
  },
  {
    path: '',
    redirectTo: '/customer/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/customer/home', // Redirection en cas de route non trouvée
  },
];
