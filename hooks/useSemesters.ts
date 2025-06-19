import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { semestersService } from "@/services/semestersService"
import type { CreateSemesterRequest, UpdateSemesterRequest } from "@/types/semester"
import { toast } from "sonner"

const SEMESTERS_QUERY_KEY = ["semesters"]

export function useSemesters() {
  return useQuery({
    queryKey: SEMESTERS_QUERY_KEY,
    queryFn: semestersService.getAllSemesters,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSemester(id: number) {
  return useQuery({
    queryKey: ["semester", id],
    queryFn: () => semestersService.getSemesterById(id),
    enabled: !!id,
  })
}

export function useSemestersByLevel(levelId: number) {
  return useQuery({
    queryKey: ["semesters", "level", levelId],
    queryFn: () => semestersService.getSemestersByLevel(levelId),
    enabled: !!levelId,
  })
}

export function useCreateSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ levelId, data }: { levelId: number; data: CreateSemesterRequest }) =>
      semestersService.createSemester(levelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEMESTERS_QUERY_KEY })
      toast.success("Semester created successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create semester")
    },
  })
}

export function useUpdateSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSemesterRequest }) =>
      semestersService.updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEMESTERS_QUERY_KEY })
      toast.success("Semester updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update semester")
    },
  })
}

export function useDeleteSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => semestersService.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEMESTERS_QUERY_KEY })
      toast.success("Semester deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete semester")
    },
  })
}
