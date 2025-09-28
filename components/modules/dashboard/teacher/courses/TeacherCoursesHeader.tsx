"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseForm } from "./CourseForm"

export function TeacherCoursesHeader() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Cours</h1>
          <p className="text-muted-foreground">
            Gérez les cours qui vous sont assignés
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="hidden">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau cours
        </Button>
      </div>
      
      <CourseForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
      />
    </>
  )
}
