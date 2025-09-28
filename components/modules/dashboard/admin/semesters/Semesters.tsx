"use client"

import { useState, useMemo } from "react"
import { useSemesters, useDeleteSemester } from "@/hooks/useSemesters"
import { useLevels } from "@/hooks/useLevels"
import { SemestersHeader } from "./SemestersHeader"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { SemestersLoading } from "./SemestersLoading"
import { SemesterForm } from "./SemesterForm"
import type { Semester } from "@/types/semester"

export function Semesters() {
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: semesters, isPending: isLoadingSemesters } = useSemesters()
  const { data: levels, isPending: isLoadingLevels } = useLevels()
  const deleteSemester = useDeleteSemester()

  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester)
    setIsFormOpen(true)
  }

  const handleDelete = (semester: Semester) => {
    deleteSemester.mutate(semester.id)
  }

  const handleCreateNew = () => {
    setEditingSemester(null)
    setIsFormOpen(true)
  }

  const enhancedSemesters = useMemo(() => {
    if (!semesters || !levels) return []
    return semesters.map((semester) => ({
      ...semester,
      levelName: levels.find((level) => level.id === semester.levelId)?.name || "N/A",
    }))
  }, [semesters, levels])

  if (isLoadingSemesters || isLoadingLevels) {
    return <SemestersLoading />
  }

  return (
    <div className="space-y-6">
      <SemestersHeader onCreateNew={handleCreateNew} />
      <DataTable
        columns={columns}
        data={enhancedSemesters}
        levels={levels || []}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />

      <SemesterForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        semester={editingSemester ?? undefined}
        mode={editingSemester ? "edit" : "create"}
      />
    </div>
  )
}
