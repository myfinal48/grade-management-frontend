"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useCoursesByTeacher, useDeleteCourse } from "@/hooks/useCourses"
import { TeacherCoursesLoading, TeacherCourseDetails, columns, DataTable, TeacherCoursesHeader, CourseForm } from "@/components/modules/dashboard/teacher/courses"
import type { Course } from "@/types/course"

export function TeacherCourses() {
  const { data: session } = useSession()
  const teacherId = session?.user?.id ? Number(session.user.id) : 0
  
  const { data: courses, isLoading } = useCoursesByTeacher({ teacherId })
  const deleteCourseMutation = useDeleteCourse()
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDetails = (course: Course) => {
    setSelectedCourse(course)
    setDetailsDialogOpen(true)
  }

  const handleDetailsDialogClose = (open: boolean) => {
    setDetailsDialogOpen(open)
    if (!open) setSelectedCourse(null)
  }

  const handleEdit = (course: Course) => {
    setEditCourse(course)
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) setEditCourse(null)
  }

  const handleDelete = (courseId: number) => {
    deleteCourseMutation.mutate(courseId)
  }

  if (isLoading) {
    return <TeacherCoursesLoading />
  }

  return (
    <div className="space-y-6">
      <TeacherCoursesHeader />
      <DataTable
        data={courses || []}
        columns={columns({ onDetails: handleDetails, onEdit: handleEdit, onDelete: handleDelete })}
      />
      <TeacherCourseDetails
        course={selectedCourse}
        open={detailsDialogOpen}
        onOpenChange={handleDetailsDialogClose}
      />
      <CourseForm
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        mode="edit"
        courseId={editCourse?.id}
        initialData={editCourse ? {
          name: editCourse.name,
          code: editCourse.code,
          credit: editCourse.credit,
          description: editCourse.description,
          semesterId: editCourse.semesterId,
          semesterName: editCourse.semesterName,
        } : undefined}
      />
    </div>
  )
} 