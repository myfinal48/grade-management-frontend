export interface Semester {
  id: number
  name: string
  startDate: string
  endDate: string
  universityYear: string
  levelId?: number
  levelName?: string
}

export interface CreateSemesterRequest {
  name: string
  startDate: string
  endDate: string
  universityYear: string
}

export interface UpdateSemesterRequest {
  name: string
  startDate: string
  endDate: string
  universityYear: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
