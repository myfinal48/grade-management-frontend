"use client"

import { useState } from "react"
import { useGrades, useDeleteGrade } from "@/hooks/useGrades"
import { GradesHeader } from "@/components/modules/dashboard/admin/grades/GradesHeader"
import { DataTable } from "@/components/modules/dashboard/admin/grades/data-table"
import { columns } from "@/components/modules/dashboard/admin/grades/columns"
import { GradesLoading } from "@/components/modules/dashboard/admin/grades/GradesLoading"
import { GradeForm } from "@/components/modules/dashboard/admin/grades/GradeForm"
import type { GradeResponseData } from "@/types/grade"

export function AdminGrades() {
  const [editingGrade, setEditingGrade] = useState<GradeResponseData | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data: grades, isPending: isLoadingGrades } = useGrades()
  const deleteGrade = useDeleteGrade()

  const handleEdit = (grade: GradeResponseData) => {
    setEditingGrade(grade)
  }

  const handleDelete = (grade: GradeResponseData) => {
    deleteGrade.mutate(grade.id)
  }

  const handleCreateNew = () => {
    setShowCreateForm(true)
  }

  if (isLoadingGrades) {
    return <GradesLoading />
  }

  return (
    <div className="space-y-6">
      <GradesHeader onCreateNew={handleCreateNew} />
      <DataTable 
        columns={columns} 
        data={grades || []} 
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />
      
      {editingGrade && (
        <GradeForm 
          open={!!editingGrade} 
          onOpenChange={(open) => !open && setEditingGrade(null)}
          grade={editingGrade}
          mode="edit"
        />
      )}

      {showCreateForm && (
        <GradeForm 
          open={showCreateForm} 
          onOpenChange={setShowCreateForm}
          mode="create"
        />
      )}
    </div>
  )
}
