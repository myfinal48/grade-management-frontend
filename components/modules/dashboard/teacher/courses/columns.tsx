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
import { AlertDialogDashboard } from "@/components/global"
import type { Course } from "@/types/course"

interface ColumnsProps {
  onDetails: (course: Course) => void
  onEdit: (course: Course) => void
  onDelete: (courseId: number) => void
}

export const columns = ({ onDetails, onEdit, onDelete }: ColumnsProps): ColumnDef<Course>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom du cours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const course = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{course.name}</span>
          <span className="text-sm text-muted-foreground">Code: {course.code}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "credit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Crédits
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.getValue("credit")}</Badge>
    },
  },
  {
    accessorKey: "semesterName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Semestre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("semesterName")}</span>
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[200px] truncate" title={description}>
          {description}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const course = row.original

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
            <DropdownMenuItem onClick={() => onDetails(course)}>
              <Eye className="mr-2 h-4 w-4" />
              Détails
            </DropdownMenuItem>
            <DropdownMenuSeparator className="hidden" />
            <DropdownMenuItem onClick={() => onEdit(course)} className="hidden">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <AlertDialogDashboard
              title="Supprimer le cours"
              description={`Êtes-vous sûr de vouloir supprimer le cours "${course.name}" ? Cette action est irréversible.`}
              onConfirm={() => onDelete(course.id)}
            >
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="text-destructive hidden"
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
