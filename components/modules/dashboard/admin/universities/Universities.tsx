"use client"

import { useState } from "react"
import { useUniversities, useDeleteUniversity } from "@/hooks/useUniversities"
import { columns, DataTable, UniversitiesLoading, UniversitiesHeader, UniversityForm } from "@/components/modules/dashboard/admin/universities"
import type { University } from "@/types/university"

export function Universities() {
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null)
  const { data: universities, isLoading } = useUniversities()
  const deleteUniversity = useDeleteUniversity()

  if (isLoading) {
    return <UniversitiesLoading />
  }

  return (
    <div className="space-y-6">
      <UniversitiesHeader />
      <DataTable 
        columns={columns} 
        data={universities || []}
        meta={{
          onEdit: (u: University) => setEditingUniversity(u),
          onDelete: (u: University) => deleteUniversity.mutate(u.id),
        }}
      />

      {editingUniversity && (
        <UniversityForm 
          open={!!editingUniversity}
          onOpenChange={(open) => !open && setEditingUniversity(null)}
          university={editingUniversity}
          mode="edit"
        />
      )}
    </div>
  )
}
