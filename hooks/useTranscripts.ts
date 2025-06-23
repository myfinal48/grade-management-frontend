import { useQuery, useMutation } from "@tanstack/react-query"
import { transcriptsService } from "@/services/transcriptsService"
import type { TranscriptFilters } from "@/types/transcript"
import { toast } from "sonner"
import type { AxiosError } from "axios"

const TRANSCRIPTS_QUERY_KEY = ["transcripts"]

interface ApiError {
  message?: string
  status?: number
  error?: string
  details?: string
}

export function useTranscripts(filters: TranscriptFilters, enabled = true) {
  return useQuery({
    queryKey: [...TRANSCRIPTS_QUERY_KEY, filters],
    queryFn: () => transcriptsService.getTranscripts(filters),
    enabled:
      enabled && (filters.studentIds.length > 0 || filters.semesterIds.length > 0 || filters.universityYear.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useExportMultipleTranscriptsPDF() {
  return useMutation({
    mutationFn: ({ filters, universityId }: { filters: TranscriptFilters; universityId?: number }) =>
      transcriptsService.exportMultipleTranscriptsPDF(filters, universityId),
    onSuccess: (blob) => {
      // Vérifier que le blob est valide
      if (!blob || blob.size === 0) {
        toast.error("Le fichier exporté est vide. Veuillez réessayer.")
        return
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "releves-notes.zip"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Relevés exportés avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Export multiple transcripts error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          params: error.config?.params,
        },
      })

      let errorMessage = "Échec de l'exportation des relevés"

      // Handle different error types
      switch (error.response?.status) {
        case 400:
          errorMessage = "Paramètres de requête invalides. Veuillez vérifier vos filtres."
          break
        case 401:
          errorMessage = "Session expirée. Veuillez vous reconnecter."
          break
        case 403:
          errorMessage = "Vous n'avez pas l'autorisation d'exporter les relevés."
          break
        case 404:
          errorMessage = "Aucun relevé trouvé correspondant à vos critères."
          break
        case 500:
          errorMessage = "Erreur serveur lors de la génération des relevés. Veuillez réessayer plus tard."
          break
        default:
          errorMessage = error.response?.data?.message ?? error.message ?? errorMessage
      }

      toast.error(errorMessage)
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
      // Vérifier que le blob est valide
      if (!blob || blob.size === 0) {
        toast.error("Le fichier exporté est vide. Veuillez réessayer.")
        return
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "releve-notes.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Relevé exporté avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Export single transcript error:", error)

      let errorMessage = "Échec de l'exportation du relevé"

      switch (error.response?.status) {
        case 400:
          errorMessage = "Paramètres invalides. Vérifiez l'ID étudiant et semestre."
          break
        case 401:
          errorMessage = "Session expirée. Veuillez vous reconnecter."
          break
        case 403:
          errorMessage = "Vous n'avez pas l'autorisation d'exporter ce relevé."
          break
        case 404:
          errorMessage = "Relevé non trouvé pour cet étudiant et semestre."
          break
        case 500:
          errorMessage = "Erreur serveur lors de la génération du relevé."
          break
        default:
          errorMessage = error.response?.data?.message ?? error.message ?? errorMessage
      }

      toast.error(errorMessage)
    },
  })
}
