import { gradeService } from "@/services/gradeService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { GradesCacheKeys } from "./const"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { GradeRequestData } from "@/types/grade"

export const useGrades = ({ gradeId, studentId, teacherId }: { gradeId?: number; studentId?: number; teacherId?: number } = {}) => {
  const getGrades = useQuery({
    queryKey: [GradesCacheKeys.Grades],
    queryFn: () => gradeService.getAll(),
  })

  const getGrade = useQuery({
    queryKey: [GradesCacheKeys.Grade, gradeId],
    queryFn: () => gradeService.getById(gradeId as number),
    enabled: !!gradeId,
  })

  const getGradesByStudent = useQuery({
    queryKey: [GradesCacheKeys.Grades, studentId],
    queryFn: () => gradeService.getByStudentId(studentId as number),
    enabled: !!studentId,
  })

  const getGradesByTeacher = useQuery({
    queryKey: [GradesCacheKeys.Grades, teacherId],
    queryFn: () => gradeService.getByTeacherId(teacherId as number),
    enabled: !!teacherId,
  })

  const createGrade = useMutation({
    mutationFn: gradeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      toast.success("Succès", { description: "Note créée avec succès" })
    },
  })

  const deleteGrade = useMutation({
    mutationFn: (id: number) => gradeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GradesCacheKeys.Grades] })
      toast.success("Succès", { description: "Note supprimée avec succès" })
    },
  })

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