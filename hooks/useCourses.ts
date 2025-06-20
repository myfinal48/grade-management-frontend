import { courseService } from "@/services/courseService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CoursesCacheKeys } from "./const"
import { toast } from "sonner"
import { queryClient } from "@/providers"

export const useCourses = ({ courseId, teacherId }: { courseId?: number, teacherId?: number } = {}) => {
  // Liste des cours
  const getCourses = useQuery({
    queryKey: [CoursesCacheKeys.Courses],
    queryFn: () => courseService.getAll(),
  })

  // Détail d'un cours
  const getCourse = useQuery({
    queryKey: [CoursesCacheKeys.Course, courseId],
    queryFn: () => courseService.getById(courseId as number),
    enabled: !!courseId,
  })

  // Création
  const createCourse = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", { description: "Cours créé avec succès" })
    },
  })

  // Suppression
  const deleteCourse = useMutation({
    mutationFn: (id: number) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", { description: "Cours supprimé avec succès" })
    },
  })

  // Edition
  const updateCourse = useMutation({
    mutationFn: (data: any) => courseService.update(courseId as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", { description: "Cours modifié avec succès" })
    },
  })

  // Assignation d'un professeur à un cours
  const assignTeacher = useMutation({
    mutationFn: ({ courseId, teacherId }: { courseId: number, teacherId: number }) => courseService.assignTeacher(courseId, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CoursesCacheKeys.Courses] })
      toast.success("Succès", { description: "Professeur assigné au cours avec succès" })
    },
  })

  // Récupération des cours par professeur
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