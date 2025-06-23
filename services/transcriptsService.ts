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

  // Export multiple transcripts as ZIP with university info
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

    console.log("Exporting multiple transcripts with university info:", {
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

    console.log("Exporting single transcript with university info:", {
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
