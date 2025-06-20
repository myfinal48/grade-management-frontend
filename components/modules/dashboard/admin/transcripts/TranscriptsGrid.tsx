"use client"

import { TranscriptCard } from "./TranscriptCard"
import type { Transcript } from "@/types/transcript"

interface TranscriptsGridProps {
  transcripts: Transcript[]
}

export function TranscriptsGrid({ transcripts }: TranscriptsGridProps) {
  if (transcripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">No transcripts found</h3>
          <p className="text-muted-foreground">
            No transcripts match your search criteria. Try adjusting your filters and search again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {transcripts.map((transcript, index) => (
        <TranscriptCard key={`${transcript.registerNumber}-${index}`} transcript={transcript} />
      ))}
    </div>
  )
}
