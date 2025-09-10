"use client"

import { useState } from "react"
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
import { Calendar, GraduationCap, Clock } from "lucide-react"
import type { Semester } from "@/types/semester"

interface SemesterDetailsProps {
  semester: Semester
  children: React.ReactNode
}

export function SemesterDetails({ semester, children }: Readonly<SemesterDetailsProps>) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {semester.name}
          </DialogTitle>
          <DialogDescription>
            Détails du semestre
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Nom du semestre
              </span>
              <span className="font-medium">{semester.name}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Année universitaire
              </span>
              <Badge variant="outline">
                {semester.universityYear}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Niveau
              </span>
              <span className="font-medium">
                {semester.levelName || "Non assigné"}
              </span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date de début
              </span>
              <span className="font-medium">
                {new Date(semester.startDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date de fin
              </span>
              <span className="font-medium">
                {new Date(semester.endDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
