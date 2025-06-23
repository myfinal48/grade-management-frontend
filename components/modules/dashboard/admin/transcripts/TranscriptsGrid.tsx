"use client"

import { TranscriptCard } from "./TranscriptCard"
import type { Transcript } from "@/types/transcript"

interface TranscriptsGridProps {
  transcripts: Transcript[]
}

export function TranscriptsGrid({ transcripts }: Readonly<TranscriptsGridProps>) {
  if (transcripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">Aucun relevé trouvé</h3>
          <p className="text-muted-foreground">
            Aucun relevé ne correspond à vos critères de recherche. Essayez ajuster vos filtres et recherchez à
            nouveau.
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
