// /**
//  * @description      : Composant pour afficher les situations des demandes validées par type
//  * @author           : ASUS
//  * @group            :
//  * @created          : 20/07/2025
//  *
//  * MODIFICATION LOG
//  * - Version         : 1.0.0
//  * - Date            : 20/05/2025
//  * - Author          : ASUS
//  * - Modification    : Création du composant
//  * - Version         : 1.1.0
//  * - Date            : 22/07/2025
//  * - Author          : ASUS
//  * - Modification    : Correction pour utiliser getSituationStatsFromValidatedDemandes()
//  **/
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DemandeServiceService } from '../../../components/demande-certificat/service/demande-service.service';

// export interface SituationStats {
//   totalPermispeche: number;
//   totalLicenceGuide: number;
//   totalLicenceCommerciale: number;
//   totalConcession: number;
//   totalCreationEtablissement: number;
// }

// @Component({
//   selector: 'app-situation-demande',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './situation-demande.component.html',
//   styleUrls: ['./situation-demande.component.css']
// })
// export class SituationDemandeComponent implements OnInit {
//   situationStats: SituationStats | null = null;
//   loading = false;
//   error = false;
//   errorMessage = '';

//   constructor(private demandeService: DemandeServiceService) { }

//   ngOnInit(): void {
//     this.loadSituationStats();
//   }

//   /**
//    * Charge les statistiques des situations de demandes
//    * Utilise d'abord l'API principale, puis la méthode de calcul en fallback
//    */
//   loadSituationStats(): void {
//     this.loading = true;
//     this.error = false;

//     // Essaie d'abord l'endpoint principal
//     this.demandeService.getSituationStats().subscribe({
//       next: (data) => {
//         this.situationStats = data;
//         this.loading = false;
//       },
//       error: (error) => {
//         console.warn('Endpoint principal non disponible, utilisation de la méthode de calcul alternative', error);

//         // Si l'endpoint principal échoue, utilise la méthode de calcul alternative
//         this.loadSituationStatsAlternative();
//       }
//     });
//   }

//   /**
//    * Méthode alternative qui calcule les statistiques à partir des demandes validées
//    */
//   private loadSituationStatsAlternative(): void {
//     this.demandeService.getSituationStatsFromValidatedDemandes().subscribe({
//       next: (data) => {
//         this.situationStats = data;
//         this.loading = false;
//         console.log('Statistiques calculées avec succès:', data);
//       },
//       error: (error) => {
//         console.error('Erreur lors du calcul des statistiques de situation', error);
//         this.error = true;
//         this.errorMessage = 'Impossible de charger les statistiques. Veuillez réessayer plus tard.';
//         this.loading = false;

//         // En cas d'erreur, on peut définir des valeurs par défaut
//         this.situationStats = {
//           totalPermispeche: 0,
//           totalLicenceGuide: 0,
//           totalLicenceCommerciale: 0,
//           totalConcession: 0,
//           totalCreationEtablissement: 0
//         };
//       }
//     });
//   }

//   /**
//    * Calcule le total général de toutes les demandes validées
//    */
//   getTotalGeneral(): number {
//     if (!this.situationStats) return 0;

//     return (this.situationStats.totalPermispeche || 0) +
//       (this.situationStats.totalLicenceGuide || 0) +
//       (this.situationStats.totalLicenceCommerciale || 0) +
//       (this.situationStats.totalConcession || 0) +
//       (this.situationStats.totalCreationEtablissement || 0);
//   }

//   /**
//    * Calcule le pourcentage d'un type de demande par rapport au total
//    */
//   getPercentage(value: number): string {
//     const total = this.getTotalGeneral();
//     if (total === 0) return '0';
//     return ((value / total) * 100).toFixed(1);
//   }

//   /**
//    * Recharge les statistiques
//    */
//   reloadStats(): void {
//     this.loadSituationStats();
//   }

//   /**
//    * Obtient le libellé formaté pour l'affichage
//    */
//   getTypeLabel(type: string): string {
//     switch (type) {
//       case 'totalPermispeche': return 'Permis de Pêche';
//       case 'totalLicenceGuide': return 'Licence de Guide';
//       case 'totalLicenceCommerciale': return 'Licence Commerciale';
//       case 'totalConcession': return 'Concession';
//       case 'totalCreationEtablissement': return 'Création d\'Établissement';
//       default: return type;
//     }
//   }

//   /**
//    * Obtient toutes les statistiques sous forme de tableau pour l'affichage
//    */
//   getStatsArray(): Array<{ key: string, label: string, value: number, percentage: string }> {
//     if (!this.situationStats) return [];

//     return [
//       {
//         key: 'totalPermispeche',
//         label: this.getTypeLabel('totalPermispeche'),
//         value: this.situationStats.totalPermispeche,
//         percentage: this.getPercentage(this.situationStats.totalPermispeche)
//       },
//       {
//         key: 'totalLicenceGuide',
//         label: this.getTypeLabel('totalLicenceGuide'),
//         value: this.situationStats.totalLicenceGuide,
//         percentage: this.getPercentage(this.situationStats.totalLicenceGuide)
//       },
//       {
//         key: 'totalLicenceCommerciale',
//         label: this.getTypeLabel('totalLicenceCommerciale'),
//         value: this.situationStats.totalLicenceCommerciale,
//         percentage: this.getPercentage(this.situationStats.totalLicenceCommerciale)
//       },
//       {
//         key: 'totalConcession',
//         label: this.getTypeLabel('totalConcession'),
//         value: this.situationStats.totalConcession,
//         percentage: this.getPercentage(this.situationStats.totalConcession)
//       },
//       {
//         key: 'totalCreationEtablissement',
//         label: this.getTypeLabel('totalCreationEtablissement'),
//         value: this.situationStats.totalCreationEtablissement,
//         percentage: this.getPercentage(this.situationStats.totalCreationEtablissement)
//       }
//     ];
//   }
// }
// a
