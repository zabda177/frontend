/**
    * @description      :
    * @author           : ASUS
    * @group            :
    * @created          : 13/12/2024 - 02:53:09
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 13/12/2024
    * - Author          : ASUS
    * - Modification    :
**/
export interface SoumissionDto {
  id: number;
  ifu: string;
  nomResponsable: string;
  prenomResponsable: string;
  denomination: string;
  siege: string;
  mailPersonneMorale: string;
  telephone1PersonneMorale: number;
  telephone2PersonneMorale: number;

  nom: string;
  prenom: string;
  genre: string;
  nationalite: string;
  dateNaissance: Date;
  villeResidence: string;
  typePiece: string;
  numPiece: string;
  telephone1PersonnePhysique: number;
  telephone2PersonnePhysique: number;
  mailPersonnePhysique: string;

  categorie: string;
  typeDemande: string;
  typeDemandeur: string;
  statut: string;
  prix: number;
  numeroDemande: number;
  codeDemande: string;
  dateRejet: string;
  motifRejet: string;
  dateDepot: Date;
  dateValidation: Date;


}




