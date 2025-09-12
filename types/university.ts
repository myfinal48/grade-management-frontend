export interface University {
  id: number
  name: string
  address: string
  phone: string
  website: string
  logoUrl: string
  fullUrl?: string
}

export interface CreateUniversityRequest {
  name: string
  address: string
  phone: string
  website: string
  logo?: File
}

export interface UpdateUniversityRequest {
  id: number
  name: string
  address: string
  phone: string
  website: string
  logo?: File
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
export interface UniversityListResponse {
  universities: University[]
  totalCount: number
}