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
import type { Course } from "@/types/course"

interface TeacherCourseDetailsProps {
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherCourseDetails({ course, open, onOpenChange }: TeacherCourseDetailsProps) {
  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{course.name}</DialogTitle>
          <DialogDescription>
            Détails du cours
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Code:</span>
            <span className="col-span-3">{course.code}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Crédits:</span>
            <div className="col-span-3">
              <Badge variant="secondary">{course.credit}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Semestre:</span>
            <span className="col-span-3">{course.semesterName}</span>
          </div>
          <Separator />
          <div className="space-y-2">
            <span className="font-medium">Description:</span>
            <p className="text-sm text-muted-foreground">
              {course.description || "Aucune description disponible"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
