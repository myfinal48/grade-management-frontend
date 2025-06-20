import { UserRole } from ".";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  role: UserRole;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  role: UserRole;
}

export interface UpdateUserRequestData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  role: UserRole;
} 