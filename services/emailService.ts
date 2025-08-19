import { apiClient } from "@/lib/axios"
import type {
  SimpleEmailRequest,
  EmailWithAttachmentRequest,
  EmailResponse,
  EmailHistoryItem,
  EmailTemplate,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from "@/types/email"

export const emailService = {
  sendSimpleEmail: async (data: SimpleEmailRequest): Promise<EmailResponse> => {
    try {
      const params = new URLSearchParams()
      params.append("to", data.to)
      params.append("recipient", data.recipient)
      params.append("body", data.body)

      const response = await apiClient.post<string>(`/emails/simple?${params.toString()}`)

      return {
        success: true,
        message: response.data || "Email envoyé avec succès",
      }
    } catch (error: unknown) {
      console.error("Send simple email error:", error)
      throw error
    }
  },

  sendEmailWithAttachment: async (data: EmailWithAttachmentRequest): Promise<EmailResponse> => {
    try {
      const formData = new FormData()
      formData.append("file", data.file)

      const params = new URLSearchParams()
      params.append("to", data.to)
      params.append("subject", data.subject || "")
      params.append("recipient", data.recipient)
      params.append("body", data.body)

      const response = await apiClient.post<string>(`/emails/upload-attachment?${params.toString()}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      })

      return {
        success: true,
        message: response.data || "Email avec pièce jointe envoyé avec succès",
      }
    } catch (error: unknown) {
      throw error
    }
  },

  getEmailHistory: async (): Promise<EmailHistoryItem[]> => {
    try {
      const response = await apiClient.get<EmailHistoryItem[]>("/emails/history")
      return response.data
    } catch (error: unknown) {
      throw error
    }
  },

  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      const response = await apiClient.get<EmailTemplate[]>("/emails/templates")
      return response.data
    } catch (error: unknown) {
      throw error
    }
  },

  createEmailTemplate: async (data: CreateEmailTemplateRequest): Promise<EmailTemplate> => {
    try {
      const response = await apiClient.post<EmailTemplate>("/emails/templates", data)
      return response.data
    } catch (error: unknown) {
      throw error
    }
  },

  updateEmailTemplate: async (data: UpdateEmailTemplateRequest): Promise<EmailTemplate> => {
    try {
      const response = await apiClient.put<EmailTemplate>(`/emails/templates/${data.id}`, data)
      return response.data
    } catch (error: unknown) {
      throw error
    }
  },

  deleteEmailTemplate: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/emails/templates/${id}`)
    } catch (error: unknown) {
      throw error
    }
  },

  deleteEmailHistory: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/emails/history/${id}`)
    } catch (error: unknown) {
      throw error
    }
  },

  updateEmailHistory: async (id: number, data: Partial<EmailHistoryItem>): Promise<EmailHistoryItem> => {
 
      const response = await apiClient.put<EmailHistoryItem>(`/emails/history/${id}`, data)
      return response.data
   
  },
}
