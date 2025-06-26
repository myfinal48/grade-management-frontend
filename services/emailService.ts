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
  // Send simple email without attachment
  sendSimpleEmail: async (data: SimpleEmailRequest): Promise<EmailResponse> => {
    try {
      const params = new URLSearchParams()
      params.append("to", data.to)
      params.append("recipient", data.recipient)
      params.append("body", data.body)

      console.log("Sending simple email:", {
        to: data.to,
        recipient: data.recipient,
        bodyLength: data.body.length,
        url: `/emails/simple?${params.toString()}`,
      })

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

  // Send email with attachment
  sendEmailWithAttachment: async (data: EmailWithAttachmentRequest): Promise<EmailResponse> => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", data.file)

      // Add query parameters
      const params = new URLSearchParams()
      params.append("to", data.to)
      params.append("subject", data.subject || "")
      params.append("recipient", data.recipient)
      params.append("body", data.body)

      console.log("Sending email with attachment:", {
        to: data.to,
        recipient: data.recipient,
        bodyLength: data.body.length,
        fileName: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type,
        url: `/emails/upload-attachment?${params.toString()}`,
      })

      const response = await apiClient.post<string>(`/emails/upload-attachment?${params.toString()}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 1 minute for file upload
      })

      return {
        success: true,
        message: response.data || "Email avec pièce jointe envoyé avec succès",
      }
    } catch (error: unknown) {
      console.error("Send email with attachment error:", error)
      throw error
    }
  },

  // Get email history
  getEmailHistory: async (): Promise<EmailHistoryItem[]> => {
    try {
      const response = await apiClient.get<EmailHistoryItem[]>("/emails/history")
      return response.data
    } catch (error: unknown) {
      console.error("Get email history error:", error)
      throw error
    }
  },

  // Get email templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      const response = await apiClient.get<EmailTemplate[]>("/emails/templates")
      return response.data
    } catch (error: unknown) {
      console.error("Get email templates error:", error)
      throw error
    }
  },

  // Create email template
  createEmailTemplate: async (data: CreateEmailTemplateRequest): Promise<EmailTemplate> => {
    try {
      const response = await apiClient.post<EmailTemplate>("/emails/templates", data)
      return response.data
    } catch (error: unknown) {
      console.error("Create email template error:", error)
      throw error
    }
  },

  // Update email template
  updateEmailTemplate: async (data: UpdateEmailTemplateRequest): Promise<EmailTemplate> => {
    try {
      const response = await apiClient.put<EmailTemplate>(`/emails/templates/${data.id}`, data)
      return response.data
    } catch (error: unknown) {
      console.error("Update email template error:", error)
      throw error
    }
  },

  // Delete email template
  deleteEmailTemplate: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/emails/templates/${id}`)
    } catch (error: unknown) {
      console.error("Delete email template error:", error)
      throw error
    }
  },

  // Delete email history
  deleteEmailHistory: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/emails/history/${id}`)
    } catch (error: unknown) {
      console.error("Delete email history error:", error)
      throw error
    }
  },

  // Update email history
  updateEmailHistory: async (id: number, data: Partial<EmailHistoryItem>): Promise<EmailHistoryItem> => {
    try {
      const response = await apiClient.put<EmailHistoryItem>(`/emails/history/${id}`, data)
      return response.data
    } catch (error: unknown) {
      console.error("Update email history error:", error)
      throw error
    }
  },
}
