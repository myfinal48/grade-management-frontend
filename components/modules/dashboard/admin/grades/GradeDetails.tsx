"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, BookOpen, Calendar } from "lucide-react"
import { GradeResponseData } from "@/types/grade"
import { formatDate } from "@/lib/utils"

interface GradeDetailsProps {
  grade: GradeResponseData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GradeDetails({ grade, open, onOpenChange }: Readonly<GradeDetailsProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la note</DialogTitle>
          <DialogDescription>
            Informations complètes sur cette note
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {grade.student?.firstName} {grade.student?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {grade.course?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{grade.value}/20</div>
              <Badge variant={grade.value >= 10 ? "default" : "destructive"}>
                {grade.value >= 10 ? "Réussi" : "Échec"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Informations étudiant
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nom complet</div>
                  <div className="text-sm">{grade.student?.firstName} {grade.student?.lastName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="text-sm">{grade.student?.email}</div>
                </div>
                {grade.student?.registrationNumber && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Numéro d&apos;inscription</div>
                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {grade.student.registrationNumber}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Informations cours
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nom du cours</div>
                  <div className="text-sm">{grade.course?.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Code</div>
                  <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {grade.course?.code}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Professeur</div>
                  <div className="text-sm">{grade.course?.teacherName || "Non assigné"}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informations temporelles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Date de création</div>
                <div className="text-sm">
                  {formatDate(new Date(grade.createdAt))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Dernière modification</div>
                <div className="text-sm">
                  {formatDate(new Date(grade.updatedAt))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
