"use client"

import { useState, useMemo } from "react"
import { useSemesters } from "@/hooks/useSemesters"
import { useLevels } from "@/hooks/useLevels"
import {
  SemestersHeader,
  SemestersGrid,
  SemestersLoading,
  SemestersError,
  SemesterForm,
} from "@/components/modules/dashboard/admin/semesters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function Semesters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { data: semesters, isLoading, error, refetch } = useSemesters()
  const { data: levels } = useLevels()

  const enhancedSemesters = useMemo(() => {
    if (!semesters || !levels) return semesters || []

    return semesters.map((semester) => ({
      ...semester,
      levelName: levels.find((level) => level.id === semester.levelId)?.name,
    }))
  }, [semesters, levels])

  const filteredSemesters = useMemo(() => {
    if (!enhancedSemesters) return []
    let filtered = enhancedSemesters
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (semester) =>
          semester.name.toLowerCase().includes(query) ||
          semester.universityYear.toLowerCase().includes(query) ||
          semester.levelName?.toLowerCase().includes(query),
      )
    }
    
    if (levelFilter !== "all") {
      filtered = filtered.filter((semester) => String(semester.levelId) === levelFilter)
    }
    
    return filtered
  }, [enhancedSemesters, searchQuery, levelFilter])

  if (isLoading) {
    return <SemestersLoading />
  }

  if (error) {
    return <SemestersError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6 relative">
      <SemestersHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        totalCount={semesters?.length || 0}
        levelFilter={levelFilter}
        onLevelFilterChange={setLevelFilter}
      />
      <SemestersGrid semesters={filteredSemesters} />

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add Semester</span>
        </Button>
      </div>

      <SemesterForm open={showCreateDialog} onOpenChange={setShowCreateDialog} mode="create" />
    </div>
  )
}
