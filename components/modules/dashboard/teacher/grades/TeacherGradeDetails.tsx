"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Calendar, TrendingUp, User } from "lucide-react"
import type { GradeResponseData } from "@/types/grade"

interface TeacherGradeDetailsProps {
  grade: GradeResponseData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherGradeDetails({ grade, open, onOpenChange }: TeacherGradeDetailsProps) {
  if (!grade) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Détail de la note</DialogTitle>
          <DialogDescription>
            Informations détaillées sur cette note attribuée
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">{grade.student?.firstName} {grade.student?.lastName}</div>
              <div className="text-sm text-muted-foreground">{grade.student?.registrationNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{grade.value}/20</div>
              <Badge variant={grade.value >= 10 ? "default" : "destructive"}>
                {grade.value >= 10 ? "Réussi" : "Échec"}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="flex items-center gap-2 font-medium mb-1">
                <User className="h-4 w-4" /> Étudiant
              </div>
              <div className="text-sm">{grade.student?.firstName} {grade.student?.lastName}</div>
              <div className="text-xs text-muted-foreground">{grade.student?.registrationNumber}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 font-medium mb-1">
                <BookOpen className="h-4 w-4" /> Cours
              </div>
              <div className="text-sm">{grade.course?.name}</div>
              <div className="text-xs text-muted-foreground">{grade.course?.code}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 font-medium mb-1">
                <TrendingUp className="h-4 w-4" /> Note attribuée
              </div>
              <div className="text-sm">{grade.value}/20</div>
            </div>
            <div>
              <div className="flex items-center gap-2 font-medium mb-1">
                <Calendar className="h-4 w-4" /> Date d&apos;attribution
              </div>
              <div className="text-sm">{new Date(grade.createdAt).toLocaleString("fr-FR")}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
