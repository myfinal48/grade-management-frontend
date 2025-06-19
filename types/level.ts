export interface Level {
  id: number
  name: string
  majorId: number
  majorName?: string // For display purposes
}

export interface CreateLevelRequest {
  name: string
  majorId: number
}

export interface UpdateLevelRequest {
  name: string
  majorId: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
