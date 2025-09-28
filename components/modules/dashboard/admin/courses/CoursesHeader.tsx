"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CoursesHeaderProps {
  onCreateNew: () => void
}

export function CoursesHeader({ onCreateNew }: Readonly<CoursesHeaderProps>) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Cours</h2>
        <p className="text-muted-foreground">
          Gérez les cours du système
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateNew} size="default" className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un Cours
        </Button>
      </div>
    </div>
  )
}