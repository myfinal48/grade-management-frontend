"use client"

import { useState, useMemo } from "react"
import { useUniversities } from "@/hooks/useUniversities"
import { UniversitiesHeader } from "@/components/modules/dashboard/admin/universities/UniversitiesHeader"
import { UniversitiesGrid } from "@/components/modules/dashboard/admin/universities/UniversitiesGrid"
import { UniversitiesLoading } from "@/components/modules/dashboard/admin/universities/UniversitiesLoading"
import { UniversitiesError } from "@/components/modules/dashboard/admin/universities/UniversitiesError"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UniversityForm } from "@/components/modules/dashboard/admin/universities/UniversityForm"

export function Universities() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { data: universities, isLoading, error, refetch } = useUniversities()

  const filteredUniversities = useMemo(() => {
    if (!universities) return []

    if (!searchQuery.trim()) return universities

    const query = searchQuery.toLowerCase()
    return universities.filter(
      (university) =>
        university.name.toLowerCase().includes(query) ||
        university.address.toLowerCase().includes(query) ||
        university.phone.toLowerCase().includes(query) ||
        university.website.toLowerCase().includes(query),
    )
  }, [universities, searchQuery])

  if (isLoading) {
    return <UniversitiesLoading />
  }

  if (error) {
    return <UniversitiesError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6 relative">
      <UniversitiesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={universities?.length ?? 0}
      />
      <UniversitiesGrid universities={filteredUniversities} />

      {/* Bouton flottant d'ajout */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Ajouter une Université</span>
        </Button>
      </div>

      <UniversityForm open={showCreateDialog} onOpenChange={setShowCreateDialog} mode="create" />
    </div>
  )
}
