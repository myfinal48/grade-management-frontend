"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Trash2, Pencil } from "lucide-react"
import { GradeResponseData } from "@/types/grade"
import { GradeDetails } from "./GradeDetails"
import { AlertDialogDashboard } from "@/components/global"

interface GradeActionsProps {
  readonly grade: GradeResponseData
  readonly onEdit?: (grade: GradeResponseData) => void
  readonly onDelete?: (grade: GradeResponseData) => void
}

export function GradeActions({ grade, onEdit, onDelete }: Readonly<GradeActionsProps>) {
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
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit?.(grade)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
          )}
          <AlertDialogDashboard
            title="Supprimer la note"
            description="Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible."
            onConfirm={() => onDelete?.(grade)}
          >
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </AlertDialogDashboard>
        </DropdownMenuContent>
      </DropdownMenu>

      <GradeDetails
        grade={grade}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  )
}

