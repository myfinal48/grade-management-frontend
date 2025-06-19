"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Calendar, Clock } from "lucide-react"
import type { Semester } from "@/types/semester"
import { SemesterForm, DeleteSemesterDialog } from "@/components/modules/dashboard/admin/semesters"

interface SemesterCardProps {
  semester: Semester
}

export function SemesterCard({ semester }: SemesterCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isActive = () => {
    const now = new Date()
    const start = new Date(semester.startDate)
    const end = new Date(semester.endDate)
    return now >= start && now <= end
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {semester.name}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  ID: {semester.id}
                </Badge>
                {isActive() && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
              </span>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Year: {semester.universityYear}
              </Badge>
              {semester.levelName && (
                <CardDescription className="text-sm">
                  Level: <span className="font-medium">{semester.levelName}</span>
                </CardDescription>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardFooter>
      </Card>

      <SemesterForm open={showEditDialog} onOpenChange={setShowEditDialog} semester={semester} mode="edit" />

      <DeleteSemesterDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} semester={semester} />
    </>
  )
}
