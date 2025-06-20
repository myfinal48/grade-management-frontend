"use client"

import type { Course } from "@/types/course"
import { CourseCard } from "./CourseCard"

interface CoursesGridProps {
  courses: Course[]
}

export function CoursesGrid({ courses }: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">No courses found</h3>
          <p className="text-muted-foreground">
            No courses match your search criteria. Try adjusting your search or create a new course.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
} 