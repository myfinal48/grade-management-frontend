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

  // Export multiple transcripts as ZIP
  exportMultipleTranscriptsPDF: async (filters: TranscriptFilters): Promise<Blob> => {
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

    console.log("Exporting multiple transcripts:", {
      filters,
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
}
