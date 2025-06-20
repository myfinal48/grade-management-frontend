import { gradeService } from "@/services/gradeService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { GradesCacheKeys } from "./const"
import { toast } from "sonner"
import { queryClient } from "@/providers"

export const useGrades = ({ gradeId, studentId }: { gradeId?: number; studentId?: number } = {}) => {
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
    mutationFn: (data: any) => gradeService.update(gradeId as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      toast.success("Succès", { description: "Note modifiée avec succès" })
    },
  })

  return {
    getGrades,
    getGrade,
    getGradesByStudent,
    createGrade,
    updateGrade,
    deleteGrade,
  }
} 