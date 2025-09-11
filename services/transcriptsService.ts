import { apiClient } from "@/lib/axios"
import type { AxiosError } from "axios"
import type { Transcript, TranscriptFilters } from "@/types/transcript"

function normalizeAndValidateFilters(filters: TranscriptFilters): TranscriptFilters {
  const normalizedStudentIds = Array.from(
    new Set(
      (filters.studentIds || [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  )

  const normalizedSemesterIds = Array.from(
    new Set(
      (filters.semesterIds || [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  )

  const trimmedYear = (filters.universityYear || "").trim()
  const year = trimmedYear.length > 0 ? trimmedYear : ""
  const yearRegex = /^\d{4}-\d{4}$/
  if (year && !yearRegex.test(year)) {
    throw new Error("Format de l'année universitaire invalide. Utilisez AAAA-AAAA (ex: 2023-2024)")
  }

  if (normalizedStudentIds.length === 0 || normalizedSemesterIds.length === 0) {
    throw new Error("Veuillez sélectionner au moins un étudiant et un semestre")
  }

  return {
    studentIds: normalizedStudentIds,
    semesterIds: normalizedSemesterIds,
    universityYear: year,
  }
}

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
    const validFilters = normalizeAndValidateFilters(filters)

    const params = new URLSearchParams()

    validFilters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    validFilters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    if (validFilters.universityYear) {
      params.append("universityYear", validFilters.universityYear)
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
    const validFilters = normalizeAndValidateFilters(filters)
    const params = new URLSearchParams()

    validFilters.studentIds.forEach((id) => {
      params.append("studentIds", id.toString())
    })

    validFilters.semesterIds.forEach((id) => {
      params.append("semesterIds", id.toString())
    })

    if (validFilters.universityYear) {
      params.append("universityYear", validFilters.universityYear)
    }

    try {
      const response = await apiClient.get(`/export/transcripts?${params.toString()}`, {
        responseType: "blob",
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream",
        },
        timeout: 120000, // 2 minutes
      })

      return response.data
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        const anyErr = error as AxiosError
        console.error("❌ Excel export error:", {
          message: (error as { message?: string }).message,
          status: anyErr?.response?.status,
          statusText: anyErr?.response?.statusText,
          data: anyErr?.response?.data,
          url: anyErr?.config?.url,
          headers: anyErr?.config?.headers,
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
