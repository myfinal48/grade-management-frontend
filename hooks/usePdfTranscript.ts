import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { pdfTranscriptService } from "@/services/pdfTranscriptService"
import type { AxiosError } from "@/types/pdfTranscript"
import { toast } from "sonner"
import type { GeneratePdfTranscriptRequest } from "@/types/pdfTranscript"

const PDF_TRANSCRIPT_QUERY_KEY = ["pdf-transcripts"]
const STUDENTS_QUERY_KEY = ["students"]

export function usePdfTranscriptRequests() {
  return useQuery({
    queryKey: PDF_TRANSCRIPT_QUERY_KEY,
    queryFn: pdfTranscriptService.getAllRequests,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry since this endpoint might not exist
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount
  })
}

export function useStudents() {
  return useQuery({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: pdfTranscriptService.getAllStudents,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry for optional endpoints
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

export function useGeneratePdfTranscript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneratePdfTranscriptRequest) => pdfTranscriptService.generateMultiple(data),
    onSuccess: ({ downloadUrl, fileName }) => {
      queryClient.invalidateQueries({ queryKey: PDF_TRANSCRIPT_QUERY_KEY })

      // Trigger download with the actual filename from server
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)

      toast.success(`Relevés PDF générés et téléchargés avec succès (${fileName})`)
    },
    onError: (error: Error) => {
      console.error("PDF generation error:", error)

      let errorMessage = "Échec de la génération des relevés PDF"
      let isEmptyBlob = false

      if (error.message === "Aucun relevé à télécharger") {
        errorMessage = error.message
        isEmptyBlob = true
      } else if (error.message) {
        errorMessage = error.message
      } else {
        const axiosError = error as AxiosError
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      }

      if (isEmptyBlob) {
        toast.info(errorMessage)
      } else {
        toast.error(errorMessage)
      }
    },
  })
}

export function useDownloadPdf() {
  return useMutation({
    mutationFn: (requestId: number) => pdfTranscriptService.downloadPdf(requestId),
    onSuccess: ({ downloadUrl, fileName }) => {
      // Trigger download with the actual filename from server
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)

      toast.success(`PDF téléchargé avec succès (${fileName})`)
    },
    onError: (error: Error) => {
      console.error("PDF download error:", error)

      let errorMessage = "Échec du téléchargement du PDF"
      let isEmptyBlob = false

      if (error.message === "Aucun relevé à télécharger") {
        errorMessage = error.message
        isEmptyBlob = true
      } else if (error.message) {
        errorMessage = error.message
      } else {
        const axiosError = error as AxiosError
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        }
      }

      if (isEmptyBlob) {
        toast.info(errorMessage)
      } else {
        toast.error(errorMessage)
      }
    },
  })
}
