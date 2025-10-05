"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GradeForm } from "@/components/modules/dashboard/teacher/grades/GradeForm"

export function TeacherGradesHeader() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Mes Notes Attribuées</h2>
        <p className="text-muted-foreground">Gérez les notes de vos étudiants</p>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une note
        </Button>
      </div>

      <GradeForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />
    </div>
  )
}
