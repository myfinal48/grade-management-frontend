"use client"

import { useState, useMemo } from "react"
import { useLevels, useDeleteLevel } from "@/hooks/useLevels"
import { useMajors } from "@/hooks/useMajors"
import { LevelsHeader } from "./LevelsHeader"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { LevelsLoading } from "./LevelsLoading"
import { LevelForm } from "./LevelForm"
import type { Level } from "@/types/level"

export function Levels() {
  const [editingLevel, setEditingLevel] = useState<Level | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: levels, isPending: isLoadingLevels } = useLevels()
  const { data: majors, isPending: isLoadingMajors } = useMajors()
  const deleteLevel = useDeleteLevel()

  const handleEdit = (level: Level) => {
    setEditingLevel(level)
    setIsFormOpen(true)
  }

  const handleDelete = (level: Level) => {
    deleteLevel.mutate(level.id)
  }

  const handleCreateNew = () => {
    setEditingLevel(null)
    setIsFormOpen(true)
  }

  const enhancedLevels = useMemo(() => {
    if (!levels || !majors) return []
    return levels.map((level) => ({
      ...level,
      majorName: majors.find((major) => major.id === level.majorId)?.name || "N/A",
    }))
  }, [levels, majors])

  if (isLoadingLevels || isLoadingMajors) {
    return <LevelsLoading />
  }

  return (
    <div className="space-y-6">
      <LevelsHeader onCreateNew={handleCreateNew} />
      <DataTable
        columns={columns}
        data={enhancedLevels}
        majors={majors || []}
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />

      <LevelForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        level={editingLevel ?? undefined}
        mode={editingLevel ? "edit" : "create"}
      />
    </div>
  )
}
