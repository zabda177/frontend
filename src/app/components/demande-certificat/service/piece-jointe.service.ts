/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 19/04/2025 - 15:49:18
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/04/2025
    * - Author          : ASUS
    * - Modification    :
**/
// piece-jointe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PieceJointeService {
  private baseUrl = 'http://127.0.0.1:8081/api';

  constructor(private http: HttpClient) { }



  /**
   * Envoie plusieurs pièces jointes pour une demande
   * @param fichiers FormData contenant les fichiers à envoyer
   * @param demandeId Identifiant de la demande
   * @returns Observable contenant la réponse du serveur
   */
  envoyerPiecesJointes(fichiers: FormData, demandeId: number): Observable<any> {
    // On ajoute l'ID de la demande au FormData si ce n'est pas déjà fait
    if (!fichiers.has('demandeId')) {
      fichiers.append('demandeId', demandeId.toString());
    }

    return this.http.post(`${this.baseUrl}/piece/fichiers-demande`, fichiers);
  }

  /**
   * Méthode spécifique pour traiter les pièces jointes provenant des composants fichier
   * @param demandeId Identifiant de la demande
   * @param fichierData Tableau de données de fichiers avec {libelle, fichier}
   * @returns Observable contenant la réponse du serveur
   */

  envoyerFichiersDemande(demandeId: number, fichierData: any[]): Observable<any> {
    const formData = new FormData();
    formData.append('demandeId', demandeId.toString());

    // Pour chaque fichier dans le tableau
    if (Array.isArray(fichierData)) {
      fichierData.forEach((file, index) => {
        // Vérifier la structure exacte du fichier
        if (file && file.fichier instanceof File) {
          formData.append(`fichiers[${index}].fichier`, file.fichier, file.fichier.name);
          formData.append(`fichiers[${index}].libelle`, file.label || 'sans_nom');
        }
      });
    }

    return this.http.post(`${this.baseUrl}/piece/fichiers`, formData);
  }

  // downloadFile(fileName: string): Observable<any> {
  //   if (!fileName) throw new Error('Nom de fichier invalide');

  //   const encodedFileName = encodeURIComponent(fileName.trim());
  //   const url = `${this.baseUrl}/piecejointe/download/${encodedFileName}`;

  //   // Utilisation de responseType 'blob' pour télécharger correctement les fichiers
  //   return this.http.get(url, {
  //     responseType: 'blob',
  //     observe: 'response'
  //   });
  // }


  // Télécharger un fichier en utilisant le nom du fichier
  downloadFile(fileName: string): Observable<Blob> {
    // Créer une requête avec le type de réponse 'blob'
    return this.http.get(`${this.baseUrl}/download/${fileName}`, {
      responseType: 'blob'
    });
  }





  /**
   * Récupère toutes les pièces jointes d'une demande
   * @param demandeId Identifiant de la demande
   * @returns Observable contenant la liste des pièces jointes
   */
  getPiecesJointesByDemande(demandeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/piece/demande/${demandeId}`);
  }

  /**
   * Supprime une pièce jointe
   * @param pieceJointeId Identifiant de la pièce jointe à supprimer
   * @returns Observable indiquant le succès de l'opération
   */
  supprimerPieceJointe(pieceJointeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/piece/${pieceJointeId}`);
  }

  /**
   * Met à jour une pièce jointe
   * @param pieceJointeId Identifiant de la pièce jointe à mettre à jour
   * @param libelle Nouveau libellé (optionnel)
   * @param fichier Nouveau fichier (optionnel)
   * @returns Observable contenant la pièce jointe mise à jour
   */
  updatePieceJointe(pieceJointeId: number, libelle?: string, fichier?: File): Observable<any> {
    const formData = new FormData();

    if (libelle) {
      formData.append('libelle', libelle);
    }

    if (fichier) {
      formData.append('fichier', fichier);
    }

    return this.http.put(`${this.baseUrl}/piece/${pieceJointeId}`, formData);
  }

  /**
   * Retourne l'URL pour visualiser un fichier
   * @param fileName Nom du fichier à visualiser
   * @returns URL complète pour accéder au fichier
   */
  getFileUrl(fileName: string): string {
    return `http://127.0.0.1:8081/uploads/${fileName}`;
  }
}
