"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, MapPin, Phone, Globe, Building } from "lucide-react"
import type { University } from "@/types/university"
import { UniversityForm } from "./UniversityForm"
import { DeleteUniversityDialog } from "@/components/modules/dashboard/admin/universities/DeleteUniversityDialog"


interface UniversityCardProps {
  university: University
}

export function UniversityCard({ university }: Readonly<UniversityCardProps>) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const logoUrl = university.logoUrl ? `${process.env.NEXT_PUBLIC_API_URL}/${university.logoUrl}` : null

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-start gap-3">
                {logoUrl ? (
                  <img
                    src={logoUrl || "/placeholder.svg"}
                    alt={`Logo ${university.name}`}
                    className="w-12 h-12 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight">{university.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs mt-1">
                    ID: {university.id}
                  </Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">{university.address}</p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <p className="text-sm font-medium">{university.phone}</p>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a
                href={university.website.startsWith("http") ? university.website : `https://${university.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
              >
                {university.website}
              </a>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </CardFooter>
      </Card>

      <UniversityForm open={showEditDialog} onOpenChange={setShowEditDialog} university={university} mode="edit" />

      <DeleteUniversityDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} university={university} />
    </>
  )
}
