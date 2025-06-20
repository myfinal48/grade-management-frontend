import { apiClient } from "@/lib/axios"
import type { AxiosError } from "@/types/pdfTranscript"
import { GeneratePdfTranscriptRequest, PdfTranscriptRequest, Student } from "@/types/pdfTranscript";

export const pdfTranscriptService = {
  // Generate multiple PDF transcripts
  generateMultiple: async (data: GeneratePdfTranscriptRequest): Promise<{ downloadUrl: string; fileName: string }> => {
    try {
      const params = new URLSearchParams()

      data.studentIds.forEach((id) => params.append("studentIds", id.toString()))
      data.semesterIds.forEach((id) => params.append("semesterIds", id.toString()))
      params.append("universityYear", data.universityYear)

      const response = await apiClient.get(`/pdf-transcript/generate-multiple?${params.toString()}`, {
        responseType: "blob",
        timeout: 60000, // 60 seconds for PDF generation
      })

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"] as string
      let fileName = "transcripts.zip" // default filename

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "")
        }
      }

      // Create blob for the ZIP response
      const blob = new Blob([response.data], { type: "application/zip" })

      // Check if blob is empty (no transcripts to download)
      if (blob.size === 0) {
        throw new Error("Aucun relevé à télécharger")
      }

      // Create download URL for the ZIP blob
      const downloadUrl = URL.createObjectURL(blob)

      return { downloadUrl, fileName }
    } catch (error) {
      const axiosError = error as AxiosError

      if (axiosError.message === "Aucun relevé à télécharger") {
        throw axiosError // Re-throw the specific empty blob error
      } else if (axiosError.response?.status === 403) {
        throw new Error(
          "Vous n'avez pas la permission de générer des relevés PDF. Veuillez contacter votre administrateur.",
        )
      } else if (axiosError.response?.status === 401) {
        throw new Error("Veuillez vous connecter pour générer des relevés PDF.")
      } else if (axiosError.code === "ECONNABORTED") {
        throw new Error("La génération PDF a expiré. Veuillez réessayer avec moins d'étudiants ou de semestres.")
      }
      throw axiosError
    }
  },

  // Get all students - Handle 403/404 gracefully
  getAllStudents: async (): Promise<Student[]> => {
    try {
      const response = await apiClient.get<Student[]>("/students")
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      // Silently handle expected errors for optional endpoints
      if (axiosError.response?.status === 403 || axiosError.response?.status === 404) {
        return []
      }

      // Only throw for unexpected errors
      throw axiosError
    }
  },

  // Get all PDF generation requests - Handle 403/404 gracefully
  getAllRequests: async (): Promise<PdfTranscriptRequest[]> => {
    try {
      const response = await apiClient.get<PdfTranscriptRequest[]>("/pdf-transcript/requests")
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      // Silently handle expected errors for optional endpoints
      if (axiosError.response?.status === 403 || axiosError.response?.status === 404) {
        return []
      }

      // Only throw for unexpected errors
      throw axiosError
    }
  },

  // Get PDF request by ID
  getRequestById: async (id: number): Promise<PdfTranscriptRequest> => {
    try {
      const response = await apiClient.get<PdfTranscriptRequest>(`/pdf-transcript/requests/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      if (axiosError.response?.status === 403) {
        throw new Error("Vous n'avez pas la permission de voir cette demande de relevé PDF.")
      }
      throw axiosError
    }
  },

  // Download PDF by request ID
  downloadPdf: async (requestId: number): Promise<{ downloadUrl: string; fileName: string }> => {
    try {
      const response = await apiClient.get(`/pdf-transcript/download/${requestId}`, {
        responseType: "blob",
        timeout: 30000,
      })

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"] as string
      let fileName = `transcript-${requestId}.zip` // default filename

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "")
        }
      }

      const blob = new Blob([response.data], { type: "application/zip" })

      // Check if blob is empty
      if (blob.size === 0) {
        throw new Error("Aucun relevé à télécharger")
      }

      const downloadUrl = URL.createObjectURL(blob)
      return { downloadUrl, fileName }
    } catch (error) {
      const axiosError = error as AxiosError

      if (axiosError.message === "Aucun relevé à télécharger") {
        throw axiosError // Re-throw the specific empty blob error
      } else if (axiosError.response?.status === 403) {
        throw new Error("Vous n'avez pas la permission de télécharger ce PDF.")
      } else if (axiosError.response?.status === 404) {
        throw new Error("PDF introuvable ou expiré.")
      }
      throw axiosError
    }
  },
}
