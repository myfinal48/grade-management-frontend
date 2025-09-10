"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SemestersHeaderProps {
  onCreateNew: () => void
}

export function SemestersHeader({ onCreateNew }: Readonly<SemestersHeaderProps>) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Semestres</h2>
        <p className="text-muted-foreground">
          Gérez les semestres académiques du système
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateNew} size="default" className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un Semestre
        </Button>
      </div>
    </div>
  )
}
