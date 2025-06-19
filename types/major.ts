export interface Major {
  id: number
  name: string
  description: string
}

export interface CreateMajorRequest {
  name: string
  description: string
}

export interface UpdateMajorRequest {
  name: string
  description: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
