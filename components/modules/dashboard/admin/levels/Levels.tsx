"use client"

import { useState, useMemo } from "react"
import { useLevels } from "@/hooks/useLevels"
import { useMajors } from "@/hooks/useMajors"
import { LevelsGrid, LevelsError, LevelsHeader, LevelsLoading } from "@/components/modules/dashboard/admin/levels"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


export function Levels() {
  const [searchQuery, setSearchQuery] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")
  const { data: levels, isLoading, error, refetch } = useLevels()
  const { data: majors } = useMajors()

  const enhancedLevels = useMemo(() => {
    if (!levels || !majors) return levels || []

    return levels.map((level) => ({
      ...level,
      majorName: majors.find((major) => major.id === level.majorId)?.name,
    }))
  }, [levels, majors])

  const filteredLevels = useMemo(() => {
    if (!enhancedLevels) return []
    let filtered = enhancedLevels
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (level) => level.name.toLowerCase().includes(query) || level.majorName?.toLowerCase().includes(query),
      )
    }
    
    if (majorFilter !== "all") {
      filtered = filtered.filter((level) => String(level.majorId) === majorFilter)
    }
    
    return filtered
  }, [enhancedLevels, searchQuery, majorFilter])

  if (isLoading) {
    return <LevelsLoading />
  }

  if (error) {
    return <LevelsError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6 relative">
      <LevelsHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        totalCount={levels?.length || 0}
        majorFilter={majorFilter}
        onMajorFilterChange={setMajorFilter}
      />
      <LevelsGrid levels={filteredLevels} />

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add Level</span>
        </Button>
      </div>
    </div>
  )
}
