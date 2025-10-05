"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Course } from "@/types/course"

interface CourseDetailsProps {
  course: Course
  children: React.ReactNode
}

export function CourseDetails({ course, children }: Readonly<CourseDetailsProps>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du cours</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le cours sélectionné
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Code</h4>
              <Badge variant="outline" className="font-mono">
                {course.code}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Crédits</h4>
              <Badge variant="secondary">
                {course.credit} crédit{course.credit > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Nom du cours</h4>
            <p className="text-sm font-medium">{course.name}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.description || "Aucune description disponible"}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Semestre</h4>
              <Badge variant="outline">
                {course.semesterName || "Non assigné"}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Professeur</h4>
              <p className="text-sm">
                {course.teacherName || "Non assigné"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
