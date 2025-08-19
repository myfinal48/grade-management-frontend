"use client"

import { useState, useMemo } from "react"
import { useCourses } from "@/hooks/useCourses"
import { CoursesLoading } from "@/components/modules/dashboard/admin/courses/CoursesLoading"
import { CoursesError } from "@/components/modules/dashboard/admin/courses/CoursesError"
import { CoursesHeader } from "./CoursesHeader"
import { CoursesGrid } from "./CoursesGrid"

export function Courses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [teacherFilter, setTeacherFilter] = useState("all")
  const { getCourses } = useCourses()
  const { data: courses, isLoading, error, refetch } = getCourses

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    let filtered = courses
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) => course.name.toLowerCase().includes(query) || course.code.toLowerCase().includes(query)
      )
    }
    
    if (teacherFilter !== "all") {
      filtered = filtered.filter((course) => String(course.teacherId) === teacherFilter)
    }
    
    return filtered
  }, [courses, searchQuery, teacherFilter])

  if (isLoading) {
    return <CoursesLoading />
  }

  if (error) {
    return <CoursesError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <CoursesHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        totalCount={courses?.length || 0}
        teacherFilter={teacherFilter}
        onTeacherFilterChange={setTeacherFilter}
      />
      <CoursesGrid courses={filteredCourses} />
    </div>
  )
} 