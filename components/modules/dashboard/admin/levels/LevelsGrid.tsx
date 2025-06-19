"use client"

import { LevelCard } from "./LevelCard"
import type { Level } from "@/types/level"

interface LevelsGridProps {
  levels: Level[]
}

export function LevelsGrid({ levels }: LevelsGridProps) {
  if (levels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">No levels found</h3>
          <p className="text-muted-foreground">
            No levels match your search criteria. Try adjusting your search or create a new level.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {levels.map((level) => (
        <LevelCard key={level.id} level={level} />
      ))}
    </div>
  )
}
