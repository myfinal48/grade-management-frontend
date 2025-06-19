"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, GraduationCap } from "lucide-react"
import type { Level } from "@/types/level"
import { LevelForm } from "./LevelForm"
import { DeleteLevelDialog } from "./DeleteLevelDialog"

interface LevelCardProps {
  level: Level
}

export function LevelCard({ level }: LevelCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {level.name}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                ID: {level.id}
              </Badge>
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Major ID: {level.majorId}
              </Badge>
            </div>
            {level.majorName && (
              <CardDescription className="text-sm">
                Associated with: <span className="font-medium">{level.majorName}</span>
              </CardDescription>
            )}
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

      <LevelForm open={showEditDialog} onOpenChange={setShowEditDialog} level={level} mode="edit" />

      <DeleteLevelDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} level={level} />
    </>
  )
}
