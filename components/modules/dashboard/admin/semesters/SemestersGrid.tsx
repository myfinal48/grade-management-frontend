"use client"

import { SemesterCard } from "@/components/modules/dashboard/admin/semesters"
import type { Semester } from "@/types/semester"

interface SemestersGridProps {
  semesters: Semester[]
}

export function SemestersGrid({ semesters }: SemestersGridProps) {
  if (semesters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">No semesters found</h3>
          <p className="text-muted-foreground">
            No semesters match your search criteria. Try adjusting your search or create a new semester.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {semesters.map((semester) => (
        <SemesterCard key={semester.id} semester={semester} />
      ))}
    </div>
  )
}
