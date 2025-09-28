import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { semestersService } from "@/services/semestersService"
import type { CreateSemesterRequest, UpdateSemesterRequest } from "@/types/semester"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
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
      toast.success("Succès", {
        description: "Semestre créé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la création du semestre");
      toast.error("", { description: message });
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
      toast.success("Succès", {
        description: "Semestre mis à jour avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la mise à jour du semestre");
      toast.error("", { description: message });
    },
  })
}

export function useDeleteSemester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => semestersService.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SemestersCacheKeys.Semesters] })
      toast.success("Succès", {
        description: "Semestre supprimé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la suppression du semestre");
      toast.error("", { description: message });
    },
  })
}
