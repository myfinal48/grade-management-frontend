"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal } from "lucide-react"
import { Transcript } from "@/types/transcript"
import { TranscriptDetails } from "./TranscriptDetails"

interface TranscriptActionsProps {
  transcript: Transcript
}

export function TranscriptActions({ transcript }: Readonly<TranscriptActionsProps>) {
  const [showDetails, setShowDetails] = useState(false)


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Détails
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TranscriptDetails
        transcript={transcript}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  )
}
