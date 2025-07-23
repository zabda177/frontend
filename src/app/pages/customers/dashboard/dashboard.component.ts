

/**
 * @description      : Dashboard modifié avec affichage dynamique des composants
 * @author           : ASUS
 * @group            :
 * @created          : 26/11/2024 - 13:19:57
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 26/11/2024
 * - Author          : ASUS
 * - Modification    :
 * - Version         : 2.0.0
 * - Date            : 30/04/2025
 * - Modification    : Refonte du dashboard pour affichage dynamique des composants
 **/
import { Component, OnInit } from '@angular/core';
import { DashboardStats } from '../../../components/demande-certificat/model/demande';
import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';
import { MenuComponent } from '../../../components/ui/menu/menu.component';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

// Import des composants de demandes

import { DemandesAccepteesComponent } from '../demandes-acceptees/demandes-acceptees.component';
import { DemandesValideesComponent } from '../demandes-validees/demandes-validees.component';
import { DemandesRejeteComponent } from '../demandes-rejete/demandes-rejete.component';
import { DemandeSoumiseComponent } from '../demande-soumise/demande-soumise.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MenuComponent,
    CommonModule,
    RouterLink,
    DemandeSoumiseComponent,
    DemandesAccepteesComponent,
    DemandesValideesComponent,
    DemandesRejeteComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  activeSection: string | null = null;

  constructor(
    private demandeService: DemandeServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.statistique();

    // Vérifier s'il y a un paramètre de section dans l'URL
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });
  }

  /**
   * Charge les statistiques du tableau de bord
   */
  statistique(): void {
    this.demandeService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
      }
    });
  }

  /**
   * Affiche la section correspondante et met à jour l'URL
   */
  afficherSection(section: string): void {
    this.activeSection = section;

    // Mise à jour de l'URL sans rechargement de la page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: section },
      queryParamsHandling: 'merge',
    });
  }
}
