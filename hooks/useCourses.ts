import { courseService } from "@/services/courseService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CoursesCacheKeys } from "./const"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { CourseRequestData, type Course } from "@/types/course"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"

export const useCourses = ({ courseId, teacherId }: { courseId?: number, teacherId?: number } = {}) => {
  const getCourses = useQuery({
    queryKey: [CoursesCacheKeys.Courses],
    queryFn: () => courseService.getAll(),
  })

  const getCourse = useQuery({
    queryKey: [CoursesCacheKeys.Course, courseId],
    queryFn: () => courseService.getById(courseId as number),
    enabled: !!courseId,
  })

  const createCourse = useMutation({
    mutationFn: courseService.create,
    onSuccess: async (created: Course, variables: CourseRequestData) => {
      if (variables?.teacherId && typeof created?.id === "number") {
        await assignTeacher.mutateAsync({ courseId: created.id, teacherId: variables.teacherId }).catch(() => {})
      }
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", { description: "Cours créé avec succès" })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la création du cours")
      toast.error("", { description: message })
    },
  })

  const deleteCourse = useMutation({
    mutationFn: (id: number) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", { description: "Cours supprimé avec succès" })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la suppression du cours")
      toast.error("", { description: message })
    },
  })

  const updateCourse = useMutation({
    mutationFn: (data: CourseRequestData) => courseService.update(courseId as number, data),
    onSuccess: async (_updated: Course, variables: CourseRequestData) => {
      if (courseId && typeof variables?.teacherId === "number") {
        await assignTeacher.mutateAsync({ courseId, teacherId: variables.teacherId }).catch(() => {})
      }
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", { description: "Cours modifié avec succès" })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la mise à jour du cours")
      toast.error("", { description: message })
    },
  })

  const assignTeacher = useMutation({
    mutationFn: ({ courseId, teacherId }: { courseId: number, teacherId: number }) => courseService.assignTeacher(courseId, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
    },
  })

  const getByTeacherId = useQuery({
    queryKey: [CoursesCacheKeys.Courses, teacherId],
    queryFn: () => courseService.getByTeacherId(teacherId as number),
    enabled: !!teacherId,
  })

  return {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    assignTeacher,
    getByTeacherId,
  }
}