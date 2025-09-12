import { useMutation, useQuery } from "@tanstack/react-query"
import { courseService } from "@/services/courseService"
import type { CourseRequestData } from "@/types/course"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { CoursesCacheKeys } from "./const"

export function useCourses() {
  return useQuery({
    queryKey: [CoursesCacheKeys.Courses],
    queryFn: courseService.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCourse(id: number) {
  return useQuery({
    queryKey: [CoursesCacheKeys.Course, id],
    queryFn: () => courseService.getById(id),
    enabled: !!id,
  })
}

export function useCoursesByTeacher({ teacherId }: { teacherId?: number }) {
  return useQuery({
    queryKey: [CoursesCacheKeys.Courses, "teacher", teacherId],
    queryFn: () => courseService.getByTeacherId(teacherId as number),
    enabled: !!teacherId,
  })
}

export function useCreateCourse() {
  return useMutation({
    mutationFn: (data: CourseRequestData) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Course] })
      toast.success("Succès", {
        description: "Cours créé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la création du cours")
      toast.error("", { description: message })
    },
  })
}

export function useUpdateCourse() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CourseRequestData }) => courseService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Course, id] })
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Course] })
      toast.success("Succès", {
        description: "Cours mis à jour avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la mise à jour du cours")
      toast.error("", { description: message })
    },
  })
}

export function useDeleteCourse() {
  return useMutation({
    mutationFn: (id: number) => courseService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Course, id] })
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Course] })
      toast.success("Succès", {
        description: "Cours supprimé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la suppression du cours")
      toast.error("", { description: message })
    },
  })
}

export function useAssignTeacher() {
  return useMutation({
    mutationFn: ({ courseId, teacherId }: { courseId: number; teacherId: number }) => 
      courseService.assignTeacher(courseId, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", {
        description: "Enseignant assigné avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de l'assignation de l'enseignant")
      toast.error("", { description: message })
    },
  })
}