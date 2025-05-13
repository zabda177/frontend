/**
 * @description      :
 * @author           : ASUS
 * @group            :
 * @created          : 25/11/2024 - 12:53:48
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 25/11/2024
 * - Author          : ASUS
 * - Modification    :
 **/
export interface SoumissionDto {
  //Propriete demandeurMorale
  id: number;
  ifu: string;
  nomResponsable: string;
  prenomResponsable: string;
  denomination: string;
  siege: string;
  mailPersonneMorale: string;
  telephone1PersonneMorale: Number;
  telephone2PersonneMorale: Number;
  // Propriete demandeurPhysique
  nom: string;
  prenom: string;
  genre: string;
  dateNaissance: Date;
  villeResidence: string;
  nationnalite: string;
  typePiece: string;
  numPiece: string;
  mailPersonnePhysique: string;
  telephone1PersonnePhysique: String;
  telephone2PersonnePhysique: String;
  // propiete de demande
  categorie: string;
  typeDemande: string;
  typeDemandeur: string;
  statut: string;
  prix: number;
  numeroDemande: number;
  codeDemande: string;
  dateDepot: string;
  dateRejet?: Date | string | null;
  motifRejet?: string | null;
  dateValidation: Date;
  fichier: File;
}
export interface PieceJointeDto {
  libellePiece: String;
  url: String;
  fichier: File;
}

export interface DashboardStats {
  demandeEncours: number;
  demandeRejete: number;
  demandeValide: number;
  demandeAccepte: number;
  totalDemandes: number;
}
export interface Region {
  id: number;
  codeDgess: string;
  libelle: string;
}
export interface Province {
  id: number;
  codeDgess: string;
  libelle: string;
  regionId: number;
  regionLibelle: string;
}
export interface Commune {
  id: number;
  codeDgess: string;
  libelle: string;
  provinceId: number;
  provinceLibelle: string;
  regionId: number;
  regionLibelle: string;
}
