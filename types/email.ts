export interface SimpleEmailRequest {
  to: string
  recipient: string
  body: string
}

export interface EmailWithAttachmentRequest {
  to: string
  recipient: string
  subject: string
  body: string
  file: File
}

export interface EmailResponse {
  success: boolean
  message: string
}

export interface EmailHistoryItem {
  id: number
  to: string
  recipient: string
  body: string
  sentAt: string
  status: string
  hasAttachment: boolean
  attachmentName?: string
  errorMessage?: string
}

export interface EmailTemplate {
  id: number
  name: string
  recipient: string
  body: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateEmailTemplateRequest {
  name: string
  recipient: string
  body: string
  variables?: string[]
}

export interface UpdateEmailTemplateRequest {
  id: number
  name: string
  recipient: string
  body: string
  variables?: string[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
