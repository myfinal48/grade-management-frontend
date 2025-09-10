"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MajorForm } from "@/components/modules/dashboard/admin/majors"

export function MajorsHeader() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold">Filières</h2>
        <p className="text-muted-foreground">Gérez vos filières</p>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une filière
        </Button>
      </div>

      <MajorForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />
    </div>
  );
}
