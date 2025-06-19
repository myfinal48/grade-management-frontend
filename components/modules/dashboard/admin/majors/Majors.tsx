"use client"

import { useState, useMemo } from "react"
import { useMajors } from "@/hooks/useMajors"
import { MajorsHeader } from "@/components/modules/dashboard/admin/majors/MajorsHeader"
import { MajorsGrid } from "@/components/modules/dashboard/admin/majors/MajorsGrid"
import { MajorsLoading } from "@/components/modules/dashboard/admin/majors/MajorsLoading"
import { MajorsError } from "@/components/modules/dashboard/admin/majors/MajorsError"

export function Majors() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: majors, isLoading, error, refetch } = useMajors()

  const filteredMajors = useMemo(() => {
    if (!majors) return []

    if (!searchQuery.trim()) return majors

    const query = searchQuery.toLowerCase()
    return majors.filter(
      (major) => major.name.toLowerCase().includes(query) || major.description.toLowerCase().includes(query),
    )
  }, [majors, searchQuery])

  if (isLoading) {
    return <MajorsLoading />
  }

  if (error) {
    return <MajorsError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <MajorsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} totalCount={majors?.length || 0} />
      <MajorsGrid majors={filteredMajors} />
    </div>
  )
}
