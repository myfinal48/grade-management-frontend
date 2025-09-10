import { useMutation, useQuery } from "@tanstack/react-query"
import { gradeService } from "@/services/gradeService"
import type { GradeRequestData } from "@/types/grade"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { GradesCacheKeys } from "./const"

export function useGrades() {
  return useQuery({
    queryKey: [GradesCacheKeys.Grades],
    queryFn: gradeService.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGrade(id: number) {
  return useQuery({
    queryKey: [GradesCacheKeys.Grade, id],
    queryFn: () => gradeService.getById(id),
    enabled: !!id,
  })
}

export function useGradesByStudent(studentId: number) {
  return useQuery({
    queryKey: [GradesCacheKeys.Grades, "student", studentId],
    queryFn: () => gradeService.getByStudentId(studentId),
    enabled: !!studentId,
  })
}

export function useGradesByTeacher(teacherId: number) {
  return useQuery({
    queryKey: [GradesCacheKeys.Grades, "teacher", teacherId],
    queryFn: () => gradeService.getByTeacherId(teacherId),
    enabled: !!teacherId,
  })
}

export function useCreateGrade() {
  return useMutation({
    mutationFn: (data: GradeRequestData) => gradeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grade] })
      toast.success("Succès", {
        description: "Note créée avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la création de la note")
      toast.error("", { description: message })
    },
  })
}

export function useUpdateGrade() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GradeRequestData }) => gradeService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grade, id] })
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grade] })
      toast.success("Succès", {
        description: "Note mise à jour avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la mise à jour de la note")
      toast.error("", { description: message })
    },
  })
}

export function useDeleteGrade() {
  return useMutation({
    mutationFn: (id: number) => gradeService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grade, id] })
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grade] })
      toast.success("Succès", {
        description: "Note supprimée avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la suppression de la note")
      toast.error("", { description: message })
    },
  })
}