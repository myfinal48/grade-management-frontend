"use client"

import { useState } from "react"
import { useCourses } from "@/hooks/useCourses"
import { useSemesters } from "@/hooks/useSemesters"
import { CoursesHeader } from "./CoursesHeader"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { CoursesLoading } from "./CoursesLoading"
import { CourseForm } from "./CourseForm"
import type { Course } from "@/types/course"

export function Courses() {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { getCourses, deleteCourse } = useCourses()
  const { data: courses, isPending: isLoadingCourses } = getCourses
  const { data: semesters, isPending: isLoadingSemesters } = useSemesters()

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setIsFormOpen(true)
  }

  const handleDelete = (course: Course) => {
    deleteCourse.mutate(course.id)
  }

  const handleCreateNew = () => {
    setEditingCourse(null)
    setIsFormOpen(true)
  }

  if (isLoadingCourses || isLoadingSemesters) {
    return <CoursesLoading />
  }

  return (
    <div className="space-y-6">
      <CoursesHeader onCreateNew={handleCreateNew} />
      <DataTable
        columns={columns}
        data={courses || []}
        semesters={semesters || []}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />

      <CourseForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        course={editingCourse ?? undefined}
        mode={editingCourse ? "edit" : "create"}
      />
    </div>
  )
}