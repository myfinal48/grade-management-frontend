"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface LevelsHeaderProps {
  onCreateNew: () => void
}

export function LevelsHeader({ onCreateNew }: Readonly<LevelsHeaderProps>) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold">Niveaux</h2>
        <p className="text-muted-foreground">Gérez vos niveaux</p>
      </div>
      <div className="flex justify-end">
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un niveau
        </Button>
      </div>
    </div>
  )
}
