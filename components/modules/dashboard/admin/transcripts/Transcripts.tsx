"use client"

import { useState } from "react"
import { useUniversities } from "@/hooks/useUniversities"
import { TranscriptsHeader } from "@/components/modules/dashboard/admin/transcripts/TranscriptsHeader"
import { TranscriptsGrid } from "@/components/modules/dashboard/admin/transcripts/TranscriptsGrid"
import { TranscriptsLoading } from "@/components/modules/dashboard/admin/transcripts/TranscriptsLoading"
import { TranscriptsError } from "@/components/modules/dashboard/admin/transcripts/TranscriptsError"
import { UniversitySelector } from "./UniversitySelector"
import type { TranscriptFilters as TTranscriptFilters } from "@/types/transcript"
import { useTranscripts, useExportMultipleTranscriptsPDF, useExportMultipleTranscriptsExcel } from "@/hooks/useTranscripts"
import { TranscriptFilterComponent } from "./TranscriptFilters"

export function Transcripts() {
  const [filters, setFilters] = useState<TTranscriptFilters>({
    studentIds: [],
    semesterIds: [],
    universityYear: "",
  })

  const [selectedUniversityId, setSelectedUniversityId] = useState<number | undefined>(undefined)
  const [hasSearched, setHasSearched] = useState(false)

  const { data: transcripts, isLoading, error, refetch } = useTranscripts(filters, hasSearched)
  const { data: universities } = useUniversities()
  const exportPDF = useExportMultipleTranscriptsPDF()
  const exportExcel = useExportMultipleTranscriptsExcel()

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

  const selectedUniversity = universities?.find((u) => u.id === selectedUniversityId)
  const isExporting = exportPDF.isPending || exportExcel.isPending

  if (!hasSearched) {
    return (
      <div className="space-y-6">
        <TranscriptsHeader
          totalCount={0}
          selectedUniversity={selectedUniversity}
          filters={filters}
          isExporting={isExporting}
        />

        {/* Sélecteur d'université */}
        <UniversitySelector
          universities={universities || []}
          selectedUniversityId={selectedUniversityId}
          onUniversityChange={setSelectedUniversityId}
        />

        <TranscriptFilterComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold">Prêt à rechercher</h3>
            <p className="text-muted-foreground">
              Sélectionnez une université, définissez vos filtres ci-dessus et cliquez sur Rechercher les Relevés pour
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
        <TranscriptsHeader
          totalCount={0}
          selectedUniversity={selectedUniversity}
          filters={filters}
          isExporting={isExporting}
        />

        <UniversitySelector
          universities={universities || []}
          selectedUniversityId={selectedUniversityId}
          onUniversityChange={setSelectedUniversityId}
        />

        <TranscriptFilterComponent
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
        selectedUniversity={selectedUniversity}
        filters={filters}
        isExporting={isExporting}
      />

      <UniversitySelector
        universities={universities || []}
        selectedUniversityId={selectedUniversityId}
        onUniversityChange={setSelectedUniversityId}
      />

      <TranscriptFilterComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <TranscriptsGrid transcripts={transcripts || []} />
    </div>
  )
}
