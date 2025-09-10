import { useMutation, useQuery } from "@tanstack/react-query"
import { majorsService } from "@/services/majorsService"
import type { CreateMajorRequest, UpdateMajorRequest } from "@/types/major"
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
    onError: (error: unknown) => {
      let message = "Echec de la création de la filiere";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error("Error", { description: message });
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
    onError: (error: unknown) => {
      let message = "Echec de la mise à jour de la filiere";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error("Error", { description: message });
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
    onError: (error: unknown) => {
      let message = "Echec de la suppression de la filiere";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error("Error", { description: message });
    },
  })
}
