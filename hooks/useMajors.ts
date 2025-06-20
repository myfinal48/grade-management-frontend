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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      toast.success("Success",{
        description: "Major created successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error",{
        description: error.response?.data?.message || "Failed to create major",
      })
    },
  })
}

export function useUpdateMajor() {

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMajorRequest }) => majorsService.updateMajor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Majors] })
      toast.success("Success",{
        description: "Major updated successfully",
      })
    },
    onError: (error: any) => {
      toast.error("Error",{
        description: error.response?.data?.message || "Failed to update major",
      })
    },
  })
}

export function useDeleteMajor() {

  return useMutation({
    mutationFn: (id: number) => majorsService.deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MajorsCacheKeys.Majors] })
      toast.success("Success",{
        description: "Major deleted successfully",
      })
    },
    onError: (error: any) => {
      toast("Error",{
        description: error.response?.data?.message || "Failed to delete major",
      })
    },
  })
}
