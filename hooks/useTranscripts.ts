import { useQuery, useMutation } from "@tanstack/react-query"
import { transcriptsService } from "@/services/transcriptsService"
import type { TranscriptFilters } from "@/types/transcript"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
import { toast } from "sonner"

export const TranscriptsCacheKeys = {
  Transcripts: "transcripts",
  Transcript: "transcript",
} as const

export function useTranscripts(filters: TranscriptFilters, enabled = true) {
  return useQuery({
    queryKey: [TranscriptsCacheKeys.Transcripts, filters],
    queryFn: () => transcriptsService.getTranscripts(filters),
    enabled:
      enabled && (filters.studentIds.length > 0 || filters.semesterIds.length > 0 || filters.universityYear.length > 0),
    staleTime: 5 * 60 * 1000,
  })
}

export function useExportMultipleTranscriptsPDF() {
  return useMutation({
    mutationFn: ({ filters, universityId }: { filters: TranscriptFilters; universityId?: number }) =>
      transcriptsService.exportMultipleTranscriptsPDF(filters, universityId),
    onSuccess: (blob) => {
      if (!blob || blob.size === 0) {
        toast.error("Le fichier exporté est vide. Veuillez réessayer.")
        return
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "releves-notes.zip"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Relevés PDF exportés avec succès")
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de l'exportation des relevés PDF")
      toast.error(message)
    },
  })
}

export function useExportMultipleTranscriptsExcel() {
  return useMutation({
    mutationFn: (filters: TranscriptFilters) => transcriptsService.exportMultipleTranscriptsExcel(filters),
    onSuccess: (blob) => {
      if (!blob || blob.size === 0) {
        toast.error("Le fichier Excel exporté est vide. Veuillez réessayer.")
        return
      }

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, "")
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `releves-notes-${timestamp}.xlsx`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`Relevés Excel exportés avec succès (${Math.round(blob.size / 1024)} KB)`)
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de l'exportation des relevés Excel")
      toast.error(message)
    },
  })
}

export function useExportSingleTranscriptPDF() {
  return useMutation({
    mutationFn: ({
      studentId,
      semesterId,
      universityYear,
      universityId,
    }: {
      studentId: number
      semesterId: number
      universityYear: string
      universityId?: number
    }) => transcriptsService.exportSingleTranscriptPDF(studentId, semesterId, universityYear, universityId),
    onSuccess: (blob) => {
      if (!blob || blob.size === 0) {
        toast.error("Le fichier exporté est vide. Veuillez réessayer.")
        return
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "releve-notes.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Relevé PDF exporté avec succès")
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de l'exportation du relevé PDF")
      toast.error(message)
    },
  })
}
