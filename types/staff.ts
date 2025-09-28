export type StaffRole = "ADMIN" | "TEACHER" | "STUDENT"

export interface Staff {
  id: number
  username: string
  password?: string
  email: string
  firstName: string
  lastName: string
  registrationNumber: string
  role: StaffRole
}
