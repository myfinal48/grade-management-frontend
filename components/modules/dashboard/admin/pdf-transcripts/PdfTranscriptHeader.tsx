"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, FileText } from "lucide-react"
import { PdfTranscriptForm } from "./PdfTranscriptForm"

interface PdfTranscriptHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
}

export function PdfTranscriptHeader({ searchQuery, onSearchChange, totalCount }: PdfTranscriptHeaderProps) {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            PDF Transcript Management
          </h1>
          <p className="text-muted-foreground">Generate and manage PDF transcripts ({totalCount} total requests)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowGenerateDialog(true)} size="default" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PDF requests..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <PdfTranscriptForm open={showGenerateDialog} onOpenChange={setShowGenerateDialog} />
    </>
  )
}
