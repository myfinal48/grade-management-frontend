import { useMutation, useQuery } from "@tanstack/react-query"
import { majorsService } from "@/services/majorsService"
import type { CreateMajorRequest, UpdateMajorRequest } from "@/types/major"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { MajorsCacheKeys } from "./const"


export function useMajors() {
  return useQuery({
    queryKey: [MajorsCacheKeys.Majors],
    queryFn: majorsService.getAllMajors,
    staleTime: 5 * 60 * 1000,
  })
}

export function useMajor(id: number) {
  return useQuery({
    queryKey: [MajorsCacheKeys.Major, id],
    queryFn: () => majorsService.getMajorById(id),
    enabled: !!id,
  })
}

export function useCreateMajor() {

  return useMutation({
    mutationFn: (data: CreateMajorRequest) => majorsService.createMajor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Majors] })
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Major] })
      toast.success("Success",{
        description: "Filiere créée avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la création de la filière");
      toast.error("", { description: message });
    },
  })
}

export function useUpdateMajor() {

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMajorRequest }) => majorsService.updateMajor(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Majors] })
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Major, id] })
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Major] })
      toast.success("Success",{
        description: "Filiere mise à jour avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la mise à jour de la filière");
      toast.error("", { description: message });
    },
  })
}

export function useDeleteMajor() {

  return useMutation({
    mutationFn: (id: number) => majorsService.deleteMajor(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Majors] })
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Major, id] })
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Major] })
      toast.success("Success",{
        description: "Filiere supprimée avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la suppression de la filière");
      toast.error("", { description: message });
    },
  })
}
