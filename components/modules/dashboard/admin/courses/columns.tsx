"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CourseDetails } from "./CourseDetails"
import { AlertDialogDashboard } from "@/components/global"
import type { Course } from "@/types/course"

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    filterFn: (row, id, value) => {
      const name = row.getValue("name") as string
      const code = row.getValue("code") as string
      const query = value.toLowerCase()
      return name.toLowerCase().includes(query) || code.toLowerCase().includes(query)
    },
  },
  {
    accessorKey: "semesterName",
    header: "Semestre",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.semesterName || "Non assigné"}</Badge>
    ),
    filterFn: (row, id, value) => {
      const semesterName = row.original.semesterName || "Non assigné"
      return semesterName.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "credit",
    header: "Crédits",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.getValue("credit")}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "teacherName",
    header: "Professeur",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.teacherName || "Non assigné"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const course = row.original
      const meta = table.options.meta as {
        onEdit?: (course: Course) => void
        onDelete?: (course: Course) => void
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CourseDetails course={course}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Eye className="mr-2 h-4 w-4" />
                Détails
              </DropdownMenuItem>
            </CourseDetails>
            <DropdownMenuItem onClick={() => meta?.onEdit?.(course)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogDashboard
              title="Supprimer le cours"
              description={`Êtes-vous sûr de vouloir supprimer le cours "${course.name}" ? Cette action est irréversible.`}
              onConfirm={() => meta?.onDelete?.(course)}
            >
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </AlertDialogDashboard>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
