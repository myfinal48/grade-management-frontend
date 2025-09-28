import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { emailService } from "@/services/emailService"
import type {
  SimpleEmailRequest,
  EmailWithAttachmentRequest,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EmailHistoryItem,
} from "@/types/email"
import { toast } from "sonner"
import type { AxiosError } from "axios"

const EMAIL_HISTORY_QUERY_KEY = ["email-history"]
const EMAIL_TEMPLATES_QUERY_KEY = ["email-templates"]

interface ApiError {
  message?: string
  status?: number
}

export function useSendSimpleEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SimpleEmailRequest) => emailService.sendSimpleEmail(data),
    onSuccess: (response) => {
      toast.success(response.message)
      queryClient.invalidateQueries({ queryKey: EMAIL_HISTORY_QUERY_KEY })
    },
    onError: (error: AxiosError<ApiError>) => {

      let errorMessage = "Échec de l'envoi de l'email"

      switch (error.response?.status) {
        case 400:
          errorMessage = "Données d'email invalides. Vérifiez l'adresse email et le contenu."
          break
        case 500:
          errorMessage = "Erreur serveur lors de l'envoi de l'email. Veuillez réessayer."
          break
        default:
          errorMessage = error.response?.data?.message ?? error.message ?? errorMessage
      }

      toast.error(errorMessage)
    },
  })
}

export function useSendEmailWithAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EmailWithAttachmentRequest) => emailService.sendEmailWithAttachment(data),
    onSuccess: (response) => {
      toast.success(response.message)
      queryClient.invalidateQueries({ queryKey: EMAIL_HISTORY_QUERY_KEY })
    },
    onError: (error: AxiosError<ApiError>) => {

      let errorMessage = "Échec de l'envoi de l'email avec pièce jointe"

      switch (error.response?.status) {
        case 400:
          errorMessage = "Fichier invalide ou données manquantes. Vérifiez le fichier et les informations."
          break
        case 413:
          errorMessage = "Fichier trop volumineux. Réduisez la taille du fichier."
          break
        case 500:
          errorMessage = "Erreur serveur lors de l'envoi de l'email. Veuillez réessayer."
          break
        default:
          errorMessage = error.response?.data?.message ?? error.message?? errorMessage
      }

      toast.error(errorMessage)
    },
  })
}

export function useEmailHistory() {
  return useQuery({
    queryKey: EMAIL_HISTORY_QUERY_KEY,
    queryFn: emailService.getEmailHistory,
    staleTime: 5 * 60 * 1000,
  })
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: EMAIL_TEMPLATES_QUERY_KEY,
    queryFn: emailService.getEmailTemplates,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEmailTemplateRequest) => emailService.createEmailTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_TEMPLATES_QUERY_KEY })
      toast.success("Modèle d'email créé avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la création du modèle"
      toast.error(errorMessage)
    },
  })
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateEmailTemplateRequest) => emailService.updateEmailTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_TEMPLATES_QUERY_KEY })
      toast.success("Modèle d'email mis à jour avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la mise à jour du modèle"
      toast.error(errorMessage)
    },
  })
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => emailService.deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_TEMPLATES_QUERY_KEY })
      toast.success("Modèle d'email supprimé avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la suppression du modèle"
      toast.error(errorMessage)
    },
  })
}

export function useDeleteEmailHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => emailService.deleteEmailHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_HISTORY_QUERY_KEY })
      toast.success("Email supprimé de l'historique avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la suppression de l'email"
      toast.error(errorMessage)
    },
  })
}

export function useUpdateEmailHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmailHistoryItem> }) =>
      emailService.updateEmailHistory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMAIL_HISTORY_QUERY_KEY })
      toast.success("Email mis à jour avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la mise à jour de l'email"
      toast.error(errorMessage)
    },
  })
}
