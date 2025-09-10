"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Hash } from "lucide-react"
import type { Major } from "@/types/major"
import type { ReactNode } from "react"

type MajorDetailsProps = {
  major: Major
  children: ReactNode
}

export const MajorDetails = ({ major, children }: MajorDetailsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Détails de la filière
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la filière sélectionnée
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <h3 className="text-lg flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Informations générales
          </h3>
          <div className="grid gap-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nom
              </label>
              <p className="mt-1 font-medium">{major.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="mt-1 text-sm leading-relaxed">
                {major.description || "Aucune description disponible"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
