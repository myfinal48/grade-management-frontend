"use client"

import { useState } from "react"
import { useMajors, useDeleteMajor } from "@/hooks/useMajors"
import { MajorsHeader } from "@/components/modules/dashboard/admin/majors/MajorsHeader"
import { DataTable } from "@/components/modules/dashboard/admin/majors/data-table"
import { columns } from "@/components/modules/dashboard/admin/majors/columns"
import { MajorsLoading } from "@/components/modules/dashboard/admin/majors/MajorsLoading"
import { MajorForm } from "@/components/modules/dashboard/admin/majors/MajorForm"
import type { Major } from "@/types/major"

export function Majors() {
  const [editingMajor, setEditingMajor] = useState<Major | null>(null)
  const { data: majors, isPending :isLoadingMajors } = useMajors()
  const deleteMajor = useDeleteMajor()
  

  const handleEdit = (major: Major) => {
    setEditingMajor(major)
  }

  const handleDelete = (major: Major) => {
    deleteMajor.mutate(major.id)
  }

  if (isLoadingMajors) {
    return <MajorsLoading />
  }

  return (
    <div className="space-y-6">
      <MajorsHeader />
      <DataTable 
        columns={columns} 
        data={majors || []} 
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />
      
      {editingMajor && (
        <MajorForm 
          open={!!editingMajor} 
          onOpenChange={(open) => !open && setEditingMajor(null)}
          major={editingMajor}
          mode="edit"
        />
      )}
    </div>
  )
}
