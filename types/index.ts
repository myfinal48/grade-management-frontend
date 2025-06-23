export const UserRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];


export type NoteDto = {
  codeUE: string;
  matiere: string;
  credits: number;
  note: number;
  mention: string;
};

export type ReleveDto = {
  nom: string;
  matricule: string;
  filiere: string;
  niveau: string;
  semestre: string;
  annee: string;
  notes: NoteDto[];
  moyenne: number;
  mention: string;
  appreciation?: string;
  creditsInscrits: number;
  creditsValides: number;
  date: string;
};
export type ReleveResponse = {
  releve: ReleveDto;
  success: boolean;
  message?: string;
};


export interface UserResponseData{
  id:number
  username:string
  email:string
  firstName:string
  lastName:string
  registrationNumber:string
  role:UserRole
}