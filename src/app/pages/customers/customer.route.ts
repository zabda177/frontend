import { ResumeComponent } from './resume/resume.component';
import { LoginComponent } from './../login/login.component';
/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 23/04/2025 - 17:59:33
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/04/2025
    * - Author          : ASUS
    * - Modification    :
**/


import { VerificationComponent } from './verification/verification/verification.component';
import { Routes } from '@angular/router';
import { MainContentComponent } from '../../components/ui/main-content/main-content.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


export const CustomerRoute: Routes = [



  // {
  //   path: 'resume',
  //   loadComponent: () =>
  //     import('./resume/resume.component').then((m) => m.ResumeComponent),

  // },

  {
    path: 'home',
    loadComponent: () =>
      import('./../../components/ui/main-content/main-content.component').then((m) => m.MainContentComponent),
  },

  {
    path: 'demandes',
    loadComponent: () =>
      import('./demande-agrement-customer/demande-agrement-customer.component').then((m) => m.DemandeAgrementCustomerComponent),
  },

  {
    path: 'verification',
    loadComponent: () =>
      import('./verification/verification/verification.component').then(
        (m) => m.VerificationComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    data: { public: true }
  },


  /* {
    path: 'demandes-detail/:id',
    loadComponent: () => import('').then((m) => m.DemamndeDetailsComponent),
  },

  {
    path: 'demandes-acceptees/:id',
    loadComponent: () =>
      import(
        './demandeAcceptées/demande-accepter-details/demande-accepter-details.component'
      ).then((m) => m.DemandeAccepterDetailsComponent),
  },
  {
    path: 'demandes/validees',
    loadComponent: () =>
      import('./demandeValides/demande-valide/demande-valide.component').then(
        (m) => m.DemandeValideComponent
      ),
  },
  {
    path: 'demandes-validees/:id',
    loadComponent: () =>
      import(
        './demandeValides/demande-valide-detail/demande-valide-detail.component'
      ).then((m) => m.DemandeValideDetailComponent),
  },

  },*/

];
