"use client"

import { useState, useMemo } from "react"
import { useLevels } from "@/hooks/useLevels"
import { useMajors } from "@/hooks/useMajors"
import { LevelsGrid, LevelsError, LevelsHeader, LevelsLoading } from "@/components/modules/dashboard/admin/levels"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


export function Levels() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: levels, isLoading, error, refetch } = useLevels()
  const { data: majors } = useMajors()

  // Enhance levels with major names
  const enhancedLevels = useMemo(() => {
    if (!levels || !majors) return levels || []

    return levels.map((level) => ({
      ...level,
      majorName: majors.find((major) => major.id === level.majorId)?.name,
    }))
  }, [levels, majors])

  const filteredLevels = useMemo(() => {
    if (!enhancedLevels) return []

    if (!searchQuery.trim()) return enhancedLevels

    const query = searchQuery.toLowerCase()
    return enhancedLevels.filter(
      (level) => level.name.toLowerCase().includes(query) || level.majorName?.toLowerCase().includes(query),
    )
  }, [enhancedLevels, searchQuery])

  if (isLoading) {
    return <LevelsLoading />
  }

  if (error) {
    return <LevelsError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6 relative">
      <LevelsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} totalCount={levels?.length || 0} />
      <LevelsGrid levels={filteredLevels} />

      {/* Floating Add Button */}
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
