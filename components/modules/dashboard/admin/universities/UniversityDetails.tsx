"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Hash, Building2, Link as LinkIcon, Phone, MapPin } from "lucide-react"
import type { University } from "@/types/university"
import type { ReactNode } from "react"

type UniversityDetailsProps = {
  university: University
  children: ReactNode
}

export const UniversityDetails = ({ university, children }: UniversityDetailsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {"Détails de l'université"}
          </DialogTitle>
          <DialogDescription>
            {"Informations complètes sur l'université sélectionnée"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <h3 className="text-lg flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Informations générales
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom</label>
              <p className="mt-1 font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" /> {university.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
              <p className="mt-1 text-sm leading-relaxed flex items-center gap-2">
                <Phone className="h-4 w-4" /> {university.phone || "—"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Adresse</label>
              <p className="mt-1 text-sm leading-relaxed flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {university.address || "—"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Site web</label>
              <p className="mt-1 text-sm leading-relaxed flex items-center gap-2">
                <LinkIcon className="h-4 w-4" /> {university.website || "—"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
