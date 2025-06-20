"use client"

import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TranscriptsHeaderProps {
  totalCount: number
  onExportAll?: () => void
}

export function TranscriptsHeader({ totalCount, onExportAll }: TranscriptsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Transcripts Management
        </h1>
        <p className="text-muted-foreground">View and manage student transcripts ({totalCount} found)</p>
      </div>
      {totalCount > 0 && onExportAll && (
        <div className="flex gap-2">
          <Button onClick={onExportAll} variant="outline" size="default">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      )}
    </div>
  )
}
