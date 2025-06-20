"use client"

import { useState, useMemo } from "react"
import { useCourses } from "@/hooks/useCourses"
import { CoursesLoading } from "@/components/modules/dashboard/admin/courses/CoursesLoading"
import { CoursesError } from "@/components/modules/dashboard/admin/courses/CoursesError"
import { CoursesHeader } from "./CoursesHeader"
import { CoursesGrid } from "./CoursesGrid"

export function Courses() {
  const [searchQuery, setSearchQuery] = useState("")
  const { getCourses } = useCourses()
  const { data: courses, isLoading, error, refetch } = getCourses

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    if (!searchQuery.trim()) return courses
    const query = searchQuery.toLowerCase()
    return courses.filter(
      (course) => course.name.toLowerCase().includes(query) || course.code.toLowerCase().includes(query)
    )
  }, [courses, searchQuery])

  if (isLoading) {
    return <CoursesLoading />
  }

  if (error) {
    return <CoursesError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <CoursesHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} totalCount={courses?.length || 0} />
      <CoursesGrid courses={filteredCourses} />
    </div>
  )
} 