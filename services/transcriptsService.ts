import { apiClient } from "@/lib/axios"
import type { Transcript, TranscriptFilters } from "@/types/transcript"

export const transcriptsService = {
  // Get transcripts with filters
  getTranscripts: async (filters: TranscriptFilters): Promise<Transcript[]> => {
    const params = new URLSearchParams()

    // Add studentIds as separate parameters
    filters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    // Add semesterIds as separate parameters
    filters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    // Add universityYear
    if (filters.universityYear) {
      params.append("universityYear", filters.universityYear)
    }

    const response = await apiClient.get<Transcript[]>(`/transcription?${params.toString()}`)
    return response.data
  },

  // Export multiple transcripts as ZIP (PDF)
  exportMultipleTranscriptsPDF: async (filters: TranscriptFilters, universityId?: number): Promise<Blob> => {
    const params = new URLSearchParams()

    // Add studentIds as separate parameters
    filters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    // Add semesterIds as separate parameters
    filters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    // Add universityYear
    if (filters.universityYear) {
      params.append("universityYear", filters.universityYear)
    }

    // Add university ID if provided
    if (universityId) {
      params.append("universityId", universityId.toString())
    }

    console.log("Exporting multiple transcripts PDF with university info:", {
      filters,
      universityId,
      url: `/pdf-transcript/generate-multiple?${params.toString()}`,
    })

    const response = await apiClient.get(`/pdf-transcript/generate-multiple?${params.toString()}`, {
      responseType: "blob",
      headers: {
        Accept: "application/octet-stream, application/zip",
      },
      timeout: 120000,
    })

    return response.data
  },

  // Export multiple transcripts as Excel
  exportMultipleTranscriptsExcel: async (filters: TranscriptFilters): Promise<Blob> => {
    const params = new URLSearchParams()

    // Add studentIds as separate parameters
    filters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    // Add semesterIds as separate parameters
    filters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    // Add universityYear
    if (filters.universityYear) {
      params.append("universityYear", filters.universityYear)
    }

    console.log("🔍 Exporting multiple transcripts Excel:", {
      filters,
      url: `/export/transcripts?${params.toString()}`,
      fullUrl: `${apiClient.defaults.baseURL}/export/transcripts?${params.toString()}`,
      params: params.toString(),
    })

    try {
      const response = await apiClient.get(`/export/transcripts?${params.toString()}`, {
        responseType: "blob",
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Type": "application/json", // Pour la requête
        },
        timeout: 120000, // 2 minutes
      })

      console.log("✅ Excel export successful:", {
        status: response.status,
        statusText: response.statusText,
        blobSize: response.data.size,
        blobType: response.data.type,
        headers: response.headers,
      })

      // Vérifier que le blob n'est pas vide
      if (response.data.size === 0) {
        throw new Error("Le fichier Excel exporté est vide")
      }

      return response.data
   // ...existing code...
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        console.error("❌ Excel export error:", {
          message: error.message,
          // @ts-expect-error: response peut exister sur l'objet error
          status: error.response?.status,
          // @ts-expect-error: response peut exister sur l'objet error
          statusText: error.response?.statusText,
          // @ts-expect-error: response peut exister sur l'objet error
          data: error.response?.data,
          // @ts-expect-error: config peut exister sur l'objet error
          url: error.config?.url,
          // @ts-expect-error: config peut exister sur l'objet error
          headers: error.config?.headers,
        })
      } else {
        console.error("❌ Excel export error:", error)
      }
      throw error
    }
  },

  // Export single transcript with university info
  exportSingleTranscriptPDF: async (
    studentId: number,
    semesterId: number,
    universityYear: string,
    universityId?: number,
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    params.append("studentId", studentId.toString())
    params.append("semesterId", semesterId.toString())
    params.append("universityYear", universityYear)

    // Add university ID if provided
    if (universityId) {
      params.append("universityId", universityId.toString())
    }

    console.log("Exporting single transcript PDF with university info:", {
      studentId,
      semesterId,
      universityYear,
      universityId,
      url: `/pdf-transcript/generate?${params.toString()}`,
    })

    const response = await apiClient.get(`/pdf-transcript/generate?${params.toString()}`, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
      timeout: 60000,
    })

    return response.data
  },
}
