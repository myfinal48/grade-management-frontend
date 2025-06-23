"use client"

import { UniversityCard } from "@/components/modules/dashboard/admin/universities/UniversityCard"
import type { University } from "@/types/university"

interface UniversitiesGridProps {
  universities: University[]
}

export function UniversitiesGrid({ universities }: Readonly<UniversitiesGridProps>) {
  if (universities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">Aucune université trouvée</h3>
          <p className="text-muted-foreground">
            Aucune université ne correspond à vos critères de recherche. Essayez d&apos;ajuster votre recherche ou créez une
            nouvelle université.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {universities.map((university) => (
        <UniversityCard key={university.id} university={university} />
      ))}
    </div>
  )
}
