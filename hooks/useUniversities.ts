import { useMutation, useQuery } from "@tanstack/react-query"
import { universityService } from "@/services/universityService"
import type { CreateUniversityRequest, UpdateUniversityRequest } from "@/types/university"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { UniversitiesCacheKeys } from "./const"


export function useUniversities() {
  return useQuery({
    queryKey: [UniversitiesCacheKeys.Universities],
    queryFn: universityService.getAllUniversities,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUniversity(id: number) {
  return useQuery({
    queryKey: [UniversitiesCacheKeys.University, id],
    queryFn: () => universityService.getUniversityById(id),
    enabled: !!id,
  })
}

export function useCreateUniversity() {

  return useMutation({
    mutationFn: (data: CreateUniversityRequest) => universityService.createUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.Universities] })
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.University] })
      toast.success("Success",{
        description: "Université créée avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la création de l'université");
      toast.error("", { description: message });
    },
  })
}

export function useUpdateUniversity() {

  return useMutation({
    mutationFn: (data: UpdateUniversityRequest) => universityService.updateUniversity(data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.Universities] })
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.University, id] })
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.University] })
      toast.success("Success",{
        description: "Université mise à jour avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la mise à jour de l'université");
      toast.error("", { description: message });
    },
  })
}

export function useDeleteUniversity() {

  return useMutation({
    mutationFn: (id: number) => universityService.deleteUniversity(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.Universities] })
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.University, id] })
      queryClient.invalidateQueries({ queryKey: [UniversitiesCacheKeys.University] })
      toast.success("Success",{
        description: "Université supprimée avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la suppression de l'université");
      toast.error("", { description: message });
    },
  })
}
