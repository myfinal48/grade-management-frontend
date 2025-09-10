"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface GradesHeaderProps {
  onCreateNew: () => void
}

export function GradesHeader({ onCreateNew }: GradesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground">
          Gérer les notes des étudiants
        </p>
      </div>
      <Button onClick={onCreateNew}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter une note
      </Button>
    </div>
  )
}
