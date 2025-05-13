/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 08/05/2025 - 01:57:59
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 08/05/2025
    * - Author          : ASUS
    * - Modification    :
**/
import { Injectable } from '@angular/core';
import {
  Commune,
  DashboardStats,
  Province,
  Region,
  SoumissionDto,
} from '../model/demande';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DemandeServiceService {
  private baseUrl = 'http://127.0.0.1:8081/api';
  private demandeSoumise: SoumissionDto | null = null;

  constructor(private http: HttpClient) { }

  // Méthodes pour les demandeurs
  envoyerDonneesDemandeurPhysique(demandeur: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/demande/demandeur/physique`, demandeur);
  }

  envoyerDonneesDemandeurMorale(demandeur: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/demande/demandeur/morale`, demandeur);
  }

  // Méthode pour envoyer uniquement les données de la demande (sans pièces jointes)
  envoyerDonneesDemande(demande: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/demande/soumission-data`, demande);
  }

  // Méthode existante pour envoyer toute la demande en une seule requête
  envoyerDemande(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post(
      `${this.baseUrl}/demande/soumission`,
      formData,
      { headers }
    );
  }



  soumettreDemande(demandeData: any, demandeur: any, fichiers: any): Observable<any> {
    const formData = new FormData();

    // Ajout des données JSON sous forme de chaînes
    formData.append('demande', JSON.stringify(demandeData));

    if (demandeur.type === 'physique') {
      formData.append('personnePhysique', JSON.stringify(demandeur.data));
    } else if (demandeur.type === 'morale') {
      formData.append('personneMorale', JSON.stringify(demandeur.data));
    }

    // Traitement des fichiers
    if (fichiers instanceof FormData) {
      // Si c'est déjà un FormData, on extrait les fichiers
      const entries = Array.from(fichiers.entries());
      for (const [key, value] of entries) {
        if (value instanceof File) {
          formData.append('fichiers', value, value.name);
        }
      }
    } else if (Array.isArray(fichiers)) {
      // Si c'est un tableau de fichiers
      fichiers.forEach((fichier, index) => {
        if (fichier instanceof File) {
          formData.append('fichiers', fichier, fichier.name);
        }
      });
    } else if (fichiers && typeof fichiers === 'object') {
      // Si c'est un objet contenant des fichiers
      Object.keys(fichiers).forEach(key => {
        const fichier = fichiers[key];
        if (fichier instanceof File) {
          formData.append('fichiers', fichier, fichier.name);
        }
      });
    }

    return this.http.post(`${this.baseUrl}/demande/soumission-complete`, formData);
  }

  // Méthode pour envoyer les données avec FormData
  envoyerToutesDonnees(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<any>(
      `${this.baseUrl}/demande/soumission-complete`,
      formData,
      { headers }
    );
  }

  getDemandeEncours(): Observable<SoumissionDto[]> {
    return this.http.get<SoumissionDto[]>(`${this.baseUrl}/demande/status/listSoumission`);
  }

  getDemandeById(id: number): Observable<SoumissionDto> {
    return this.http.get<SoumissionDto>(`${this.baseUrl}/demande/demandes${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  accepterDemande(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/demande/${id}/accepte`, {});
  }

  validerDemande(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/demande/${id}/valide`, {});
  }

  getDemandeAccepte(): Observable<SoumissionDto[]> {
    return this.http.get<SoumissionDto[]>(`${this.baseUrl}/demande/accepte`);
  }

  getDemandeRejete(): Observable<SoumissionDto[]> {
    return this.http.get<SoumissionDto[]>(`${this.baseUrl}/demande/rejete`);
  }


  getDemandeValide(): Observable<SoumissionDto[]> {
    return this.http.get<SoumissionDto[]>(`${this.baseUrl}/demande/valide`);
  }

  getDemandeDetails(numeroDemande: number, codeDemande: string): Observable<SoumissionDto> {
    return this.http.get<SoumissionDto>(`${this.baseUrl}/demande${numeroDemande}/${codeDemande}`);
  }

  soumission(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData, { responseType: 'text' });
  }

  getRegions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/region`);
  }

  getProvinceByRegion(regionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/province/by-region/id?regionId=${regionId}`
    );
  }

  getCommuneByProvince(provinceId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/commune/provincce/${provinceId}`
    );
  }

  setDemandeSoumise(data: SoumissionDto): void {
    this.demandeSoumise = data;
  }

  getDemandeSoumise(): SoumissionDto | null {
    return this.demandeSoumise;
  }

  clearDemandeData(): void {
    this.demandeSoumise = null;
  }

  login(numeroDemande: number, codeDemande: String): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/demande/demande${numeroDemande}/$codeDemande}`
    );
  }

  rejeterDemande(id: number, motif: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/demande/${id}/rejete`, {
      motifRejet: motif
    });
  }

  reconsidererDemande(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/demande/${id}/reconsiderer`, {});
  }

  getDemandeDetailsByCode(codeDemande: string): Observable<any> {
    const url = `${this.baseUrl}/demande/demandes/code/${codeDemande}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response.step) {
          switch (response.statutDemande) {
            case 'SOUMISE': response.step = 1; break;
            case 'ACCEPTEE': response.step = 2; break;
            case 'VALIDEE_COMITE': response.step = 3; break;
            case 'REJETEE': response.step = 4; break;
            default: response.step = 4;
          }
        }

        response.status = this.getStatusLabel(response.step);
        return response;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des détails de la demande', error);
        return throwError(() => error);
      })
    );
  }

  private getStatusLabel(step: number): string {
    switch (step) {
      case -1: return 'Demande Rejetée';
      case 0: return 'État Initial';
      case 1: return 'Demande Soumise';
      case 2: return 'Demande Acceptée pour Traitement';
      case 3: return 'Demande Validée par le Sous Comité';
      case 4: return 'Approbation du Ministère';
      case 5: return 'Agrément Disponible';
      default: return 'Inconnu';
    }
  }



}




