"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Hash, User as UserIcon, Mail, IdCard, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/user"
import type { ReactNode } from "react"
import { UserRoles } from "@/types"

type UserDetailsProps = {
  user: User
  children: ReactNode
}

export const UserDetails = ({ user, children }: UserDetailsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {"Détails de l'utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {"Informations complètes sur l'utilisateur sélectionné"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <h3 className="text-lg flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Informations générales
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
              <p className="mt-1 font-medium flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Rôle</label>
              <div className="mt-1 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <Badge 
                  variant={
                    user.role === UserRoles.ADMIN 
                      ? "destructive" 
                      : user.role === UserRoles.TEACHER 
                      ? "default" 
                      : "secondary"
                  }
                >
                  {user.role}
                </Badge>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1 text-sm leading-relaxed flex items-center gap-2">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{"Nom d'utilisateur"}</label>
              <p className="mt-1 text-sm font-mono bg-muted px-2 py-1 rounded flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> {user.username}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Matricule</label>
              <p className="mt-1 text-sm font-mono bg-muted px-2 py-1 rounded flex items-center gap-2">
                <IdCard className="h-4 w-4" /> {user.registrationNumber || "—"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
