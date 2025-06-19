"use client"


import type { Major } from "@/types/major"
import { MajorCard } from "@/components/modules/dashboard/admin/majors/MajorCard"

interface MajorsGridProps {
  majors: Major[]
}

export function MajorsGrid({ majors }: MajorsGridProps) {
  if (majors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">No majors found</h3>
          <p className="text-muted-foreground">
            No majors match your search criteria. Try adjusting your search or create a new major.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {majors.map((major) => (
        <MajorCard key={major.id} major={major} />
      ))}
    </div>
  )
}
