import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { semestersService } from "@/services/semestersService"
import type { CreateSemesterRequest, UpdateSemesterRequest } from "@/types/semester"
import { toast } from "sonner"
import { LevelsCacheKeys, SemestersCacheKeys } from "./const"


export function useSemesters() {
  return useQuery({
    queryKey: [SemestersCacheKeys.Semesters],
    queryFn: semestersService.getAllSemesters,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSemester(id: number) {
  return useQuery({
    queryKey: [SemestersCacheKeys.Semester, id],
    queryFn: () => semestersService.getSemesterById(id),
    enabled: !!id,
  })
}

export function useSemestersByLevel(levelId: number) {
  return useQuery({
    queryKey: [SemestersCacheKeys.Semesters, LevelsCacheKeys.Level, levelId],
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
      queryClient.invalidateQueries({ queryKey: [SemestersCacheKeys.Semesters] })
      toast.success("Semester created successfully")
    },
    onError: (error: unknown) => {
      let message = "Failed to create semester";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error(message);
    },
  })
}

export function useUpdateSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSemesterRequest }) =>
      semestersService.updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SemestersCacheKeys.Semesters] })
      toast.success("Semester updated successfully")
    },
    onError: (error: unknown) => {
      let message = "Failed to update semester";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error(message);
    },
  })
}

export function useDeleteSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => semestersService.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SemestersCacheKeys.Semesters] })
      toast.success("Semester deleted successfully")
    },
    onError: (error: unknown) => {
      let message = "Failed to delete semester";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error(message);
    },
  })
}
