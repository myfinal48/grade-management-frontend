import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { universityService } from "@/services/universityService"
import type { CreateUniversityRequest, UpdateUniversityRequest } from "@/types/university"
import { toast } from "sonner"
import { AxiosError } from "axios"


const UNIVERSITIES_QUERY_KEY = ["universities"]

interface ApiError {
  message?: string
  status?: number
}

export function useUniversities() {
  return useQuery({
    queryKey: UNIVERSITIES_QUERY_KEY,
    queryFn: universityService.getAllUniversities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUniversity(id: number) {
  return useQuery({
    queryKey: ["university", id],
    queryFn: () => universityService.getUniversityById(id),
    enabled: !!id,
  })
}

export function useCreateUniversity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUniversityRequest) => universityService.createUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNIVERSITIES_QUERY_KEY })
      toast.success("Université créée avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la création de l'université"
      toast.error(errorMessage)
    },
  })
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUniversityRequest) => universityService.updateUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNIVERSITIES_QUERY_KEY })
      toast.success("Université mise à jour avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la mise à jour de l'université"
      toast.error(errorMessage)
    },
  })
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => universityService.deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNIVERSITIES_QUERY_KEY })
      toast.success("Université supprimée avec succès")
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error.response?.data?.message ?? "Échec de la suppression de l'université"
      toast.error(errorMessage)
    },
  })
}
