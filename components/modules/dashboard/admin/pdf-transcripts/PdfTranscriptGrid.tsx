"use client"

import { PdfTranscriptRequest } from "@/types/pdfTranscript"
import { PdfTranscriptCard } from "./PdfTranscriptCard"

interface PdfTranscriptGridProps {
  requests: PdfTranscriptRequest[]
}

export function PdfTranscriptGrid({ requests }: PdfTranscriptGridProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">No PDF requests found</h3>
          <p className="text-muted-foreground">
            No PDF transcript requests match your search criteria. Try adjusting your search or generate a new PDF.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <PdfTranscriptCard key={request.id} request={request} />
      ))}
    </div>
  )
}
