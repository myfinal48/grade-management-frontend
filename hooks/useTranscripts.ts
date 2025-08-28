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
    onError: (error: AxiosError<ApiError>) => {
      let errorMessage = "Échec de l'exportation des relevés PDF"

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
          errorMessage = "Erreur serveur lors de la génération des relevés PDF."
          break
        default:
          errorMessage = error.response?.data?.message ?? error.message ?? errorMessage
      }

      toast.error(errorMessage)
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
    onError: (error: AxiosError<ApiError>) => {

      let errorMessage = "Échec de l'exportation des relevés Excel"

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
          errorMessage = "Erreur serveur lors de la génération des relevés Excel."
          break
        case 504:
          errorMessage = "Timeout - L'export prend trop de temps. Réduisez le nombre de relevés."
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
    onError: (error: AxiosError<ApiError>) => {

      let errorMessage = "Échec de l'exportation du relevé PDF"

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
          errorMessage = "Erreur serveur lors de la génération du relevé PDF."
          break
        default:
          errorMessage = error.response?.data?.message ?? error.message ?? errorMessage
      }

      toast.error(errorMessage)
    },
  })
}
