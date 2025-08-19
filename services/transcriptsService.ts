import { apiClient } from "@/lib/axios"
import type { Transcript, TranscriptFilters } from "@/types/transcript"

export const transcriptsService = {
  getTranscripts: async (filters: TranscriptFilters): Promise<Transcript[]> => {
    const params = new URLSearchParams()

    filters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    filters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    if (filters.universityYear) {
      params.append("universityYear", filters.universityYear)
    }

    const response = await apiClient.get<Transcript[]>(`/transcription?${params.toString()}`)
    return response.data
  },

  exportMultipleTranscriptsPDF: async (filters: TranscriptFilters, universityId?: number): Promise<Blob> => {
    const params = new URLSearchParams()

    filters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    filters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    if (filters.universityYear) {
      params.append("universityYear", filters.universityYear)
    }

    if (universityId) {
      params.append("universityId", universityId.toString())
    }

    const response = await apiClient.get(`/pdf-transcript/generate-multiple?${params.toString()}`, {
      responseType: "blob",
      headers: {
        Accept: "application/octet-stream, application/zip",
      },
      timeout: 120000,
    })

    return response.data
  },

  exportMultipleTranscriptsExcel: async (filters: TranscriptFilters): Promise<Blob> => {
    const params = new URLSearchParams()

    filters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    filters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    if (filters.universityYear) {
      params.append("universityYear", filters.universityYear)
    }

    try {
      const response = await apiClient.get(`/export/transcripts?${params.toString()}`, {
        responseType: "blob",
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Type": "application/json", // Pour la requête
        },
        timeout: 120000, // 2 minutes
      })

      return response.data
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
      } 
      throw error
    }
  },

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
