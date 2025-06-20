export interface PdfTranscriptRequest {
  id: number
  studentIds: number[]
  semesterIds: number[]
  universityYear: string
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  fileName?: string
  studentNames?: string[] // For display purposes
  semesterNames?: string[] // For display purposes
}

export interface GeneratePdfTranscriptRequest {
  studentIds: number[]
  semesterIds: number[]
  universityYear: string
}

export interface Student {
  id: number
  firstName: string
  lastName: string
  studentNumber: string
  email?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
export interface ApiError {
  message: string
  status?: number
  code?: string
}

export interface ApiErrorResponse {
  message: string
  error?: string
  timestamp?: string
  path?: string
}

export interface AxiosErrorResponse {
  data?: ApiErrorResponse
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface AxiosError {
  response?: AxiosErrorResponse
  message: string
  code?: string
  config?: {
    url?: string
    method?: string
  }
}
