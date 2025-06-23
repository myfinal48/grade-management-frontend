"use client"

import { useState } from "react"
import { useTranscripts, useExportMultipleTranscriptsPDF } from "@/hooks/useTranscripts"
import { useUniversities } from "@/hooks/useUniversities"
import { TranscriptsHeader } from "./TranscriptsHeader"
import { TranscriptsGrid } from "./TranscriptsGrid"
import { TranscriptsLoading } from "./TranscriptsLoading"
import { TranscriptsError } from "./TranscriptsError"
import { UniversitySelector } from "./UniversitySelector"
import type { TranscriptFilters as TTranscriptFilters } from "@/types/transcript"
import { TranscriptFilters } from "./TranscriptFilters"

export function Transcripts() {
  const [filters, setFilters] = useState<TTranscriptFilters>({
    studentIds: [],
    semesterIds: [],
    universityYear: "",
  })

  const [selectedUniversityId, setSelectedUniversityId] = useState<number | undefined>(undefined)
  const [hasSearched, setHasSearched] = useState(false)
  const exportMultiple = useExportMultipleTranscriptsPDF()

  const { data: transcripts, isLoading, error, refetch } = useTranscripts(filters, hasSearched)
  const { data: universities } = useUniversities()

  const handleSearch = () => {
    setHasSearched(true)
  }

  const handleFiltersChange = (newFilters: TTranscriptFilters) => {
    setFilters(newFilters)
    // Reset search state when filters change
    if (hasSearched) {
      setHasSearched(false)
    }
  }

  const handleExportAll = () => {
    console.log("Exporting with university ID:", selectedUniversityId)
    exportMultiple.mutate({
      filters,
      universityId: selectedUniversityId,
    })
  }

  if (!hasSearched) {
    return (
      <div className="space-y-6">
        <TranscriptsHeader totalCount={0} />

        {/* Sélecteur d'université */}
        <UniversitySelector
          universities={universities || []}
          selectedUniversityId={selectedUniversityId}
          onUniversityChange={setSelectedUniversityId}
        />

        <TranscriptFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold">Prêt à rechercher</h3>
            <p className="text-muted-foreground">
              Sélectionnez une université, définissez vos filtres ci-dessus et cliquez sur &apos;Rechercher les Relevés&apos; pour
              consulter les relevés de notes des étudiants.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <TranscriptsLoading />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <TranscriptsHeader totalCount={0} />

        <UniversitySelector
          universities={universities || []}
          selectedUniversityId={selectedUniversityId}
          onUniversityChange={setSelectedUniversityId}
        />

        <TranscriptFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        <TranscriptsError error={error} onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TranscriptsHeader
        totalCount={transcripts?.length ?? 0}
        onExportAll={transcripts && transcripts.length > 0 ? handleExportAll : undefined}
        isExporting={exportMultiple.isPending}
        selectedUniversity={universities?.find((u) => u.id === selectedUniversityId)}
      />

      <UniversitySelector
        universities={universities || []}
        selectedUniversityId={selectedUniversityId}
        onUniversityChange={setSelectedUniversityId}
      />

      <TranscriptFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <TranscriptsGrid transcripts={transcripts || []} />
    </div>
  )
}
export default Transcripts