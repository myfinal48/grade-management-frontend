"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useGradesByTeacher, useDeleteGrade } from "@/hooks/useGrades"
import { useCourses } from "@/hooks/useCourses"
import { TeacherGradesLoading, TeacherGradeDetails, columns, DataTable, TeacherGradesHeader, GradeForm } from "@/components/modules/dashboard/teacher/grades"
import type { GradeResponseData } from "@/types/grade"

export function TeacherGrades() {
  const { data: session } = useSession()
  const teacherId = session?.user?.id ? Number(session.user.id) : 0
  
  const { data: grades, isLoading } = useGradesByTeacher({ teacherId })
  const { getByTeacherId } = useCourses({ teacherId })
  const courses = getByTeacherId.data || []
  
  const [selectedGrade, setSelectedGrade] = useState<GradeResponseData | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [editGrade, setEditGrade] = useState<GradeResponseData | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const deleteGradeMutation = useDeleteGrade()

  const handleDetails = (grade: GradeResponseData) => {
    setSelectedGrade(grade)
    setDetailsDialogOpen(true)
  }

  const handleDetailsDialogClose = (open: boolean) => {
    setDetailsDialogOpen(open)
    if (!open) setSelectedGrade(null)
  }

  const handleEdit = (grade: GradeResponseData) => {
    setEditGrade(grade)
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) setEditGrade(null)
  }

  const handleDelete = (gradeId: number) => {
    deleteGradeMutation.mutate(gradeId)
  }

  if (isLoading) {
    return <TeacherGradesLoading />
  }

  return (
    <div className="space-y-6">
      <TeacherGradesHeader />
      <DataTable
        data={grades || []}
        columns={columns({ onDetails: handleDetails, onEdit: handleEdit, onDelete: handleDelete })}
        courses={courses}
      />
      <TeacherGradeDetails
        grade={selectedGrade}
        open={detailsDialogOpen}
        onOpenChange={handleDetailsDialogClose}
      />
      <GradeForm
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        mode="edit"
        gradeId={editGrade?.id}
        initialData={editGrade ? {
          studentId: editGrade.student?.id,
          courseId: editGrade.course?.id,
          value: editGrade.value,
        } : undefined}
      />
    </div>
  )
} 