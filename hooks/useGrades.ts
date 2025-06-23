import { gradeService } from "@/services/gradeService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { GradesCacheKeys } from "./const"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { GradeRequestData } from "@/types/grade"

export const useGrades = ({ gradeId, studentId, teacherId }: { gradeId?: number; studentId?: number; teacherId?: number } = {}) => {
  // Liste des notes
  const getGrades = useQuery({
    queryKey: [GradesCacheKeys.Grades],
    queryFn: () => gradeService.getAll(),
  })

  // Détail d'une note
  const getGrade = useQuery({
    queryKey: [GradesCacheKeys.Grade, gradeId],
    queryFn: () => gradeService.getById(gradeId as number),
    enabled: !!gradeId,
  })

  // Liste des notes d'un étudiant
  const getGradesByStudent = useQuery({
    queryKey: [GradesCacheKeys.Grades, studentId],
    queryFn: () => gradeService.getByStudentId(studentId as number),
    enabled: !!studentId,
  })

  // Liste des notes d'un enseignant
  const getGradesByTeacher = useQuery({
    queryKey: [GradesCacheKeys.Grades, teacherId],
    queryFn: () => gradeService.getByTeacherId(teacherId as number),
    enabled: !!teacherId,
  })

  // Création
  const createGrade = useMutation({
    mutationFn: gradeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      toast.success("Succès", { description: "Note créée avec succès" })
    },
  })

  // Suppression
  const deleteGrade = useMutation({
    mutationFn: (id: number) => gradeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      toast.success("Succès", { description: "Note supprimée avec succès" })
    },
  })

  // Edition
  const updateGrade = useMutation({
    mutationFn: (data: GradeRequestData) => gradeService.update(gradeId as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      toast.success("Succès", { description: "Note modifiée avec succès" })
    },
  })

  return {
    getGrades,
    getGrade,
    getGradesByStudent,
    getGradesByTeacher,
    createGrade,
    updateGrade,
    deleteGrade,
  }
} 