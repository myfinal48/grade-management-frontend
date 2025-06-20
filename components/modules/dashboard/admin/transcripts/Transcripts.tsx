"use client"

import { useState } from "react"
import { useTranscripts } from "@/hooks/useTranscripts"
import { TranscriptsHeader, TranscriptFilters, TranscriptsGrid, TranscriptsLoading, TranscriptsError } from "@/components/modules/dashboard/admin/transcripts"
import type { TranscriptFilters as TTranscriptFilters } from "@/types/transcript"

export function Transcripts() {
  const [filters, setFilters] = useState<TTranscriptFilters>({
    studentIds: [],
    semesterIds: [],
    universityYear: "",
  })

  const [hasSearched, setHasSearched] = useState(false)

  const { data: transcripts, isLoading, error, refetch } = useTranscripts(filters, hasSearched)

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
    // TODO: Implement export functionality
    console.log("Exporting all transcripts...")
  }

  if (!hasSearched) {
    return (
      <div className="space-y-6">
        <TranscriptsHeader totalCount={0} />
        <TranscriptFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold">Ready to search</h3>
            <p className="text-muted-foreground">
              Set your filters above and click &quot;Search Transcripts&quot; to view student transcripts.
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
        totalCount={transcripts?.length || 0}
        onExportAll={transcripts && transcripts.length > 0 ? handleExportAll : undefined}
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
