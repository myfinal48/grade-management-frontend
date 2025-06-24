"use client"

import { useState } from "react"
import { FileText, Download, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { University } from "@/types/university"
import type { TranscriptFilters } from "@/types/transcript"
import { ExportFormatModal } from "@/components/modules/dashboard/admin/transcripts/ExportFormatModal"

interface TranscriptsHeaderProps {
  totalCount: number
  selectedUniversity?: University
  filters: TranscriptFilters
  isExporting?: boolean
}

export function TranscriptsHeader({ totalCount, selectedUniversity, filters, isExporting }: Readonly<TranscriptsHeaderProps>) {
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Gestion des Relevés de Notes
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">
              Consulter et gérer les relevés de notes des étudiants ({totalCount} trouvé{totalCount > 1 ? "s" : ""})
            </p>
            {selectedUniversity && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {selectedUniversity.name}
              </Badge>
            )}
          </div>
        </div>
        {totalCount > 0 && (
          <div className="flex gap-2">
            <Button onClick={() => setShowExportModal(true)} variant="outline" size="default" disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exportation..." : "Exporter"}
            </Button>
          </div>
        )}
      </div>

      <ExportFormatModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        filters={filters}
        selectedUniversity={selectedUniversity}
        totalCount={totalCount}
      />
    </>
  )
}
