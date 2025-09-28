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
import type { GradeResponseData } from "@/types/grade"

interface ColumnsProps {
  onDetails: (grade: GradeResponseData) => void
  onEdit: (grade: GradeResponseData) => void
  onDelete: (gradeId: number) => void
}

export const columns = ({ onDetails, onEdit, onDelete }: ColumnsProps): ColumnDef<GradeResponseData>[] => [
  {
    accessorKey: "student",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Étudiant
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const student = row.original.student
      return (
        <div>
          <div className="font-medium">
            {student?.firstName} {student?.lastName}
          </div>
          <div className="text-sm text-muted-foreground">
            {student?.registrationNumber}
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const student = row.original.student
      if (!student) return false
      const searchValue = value.toLowerCase()
      return (
        student.firstName?.toLowerCase().includes(searchValue) ||
        student.lastName?.toLowerCase().includes(searchValue) ||
        student.registrationNumber?.toLowerCase().includes(searchValue)
      )
    },
  },
  {
    accessorKey: "course",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const course = row.original.course
      return (
        <div>
          <div className="font-medium">{course?.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{course?.code}</div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const course = row.original.course
      if (!course) return false
      return String(course.id) === value
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Note
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"))
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}/20</span>
          <Badge variant={value >= 10 ? "default" : "destructive"}>
            {value >= 10 ? "Réussi" : "Échec"}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="text-muted-foreground">
          {date.toLocaleDateString("fr-FR")}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const grade = row.original

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
            <DropdownMenuItem onClick={() => onDetails(grade)}>
              <Eye className="mr-2 h-4 w-4" />
              Détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(grade)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <AlertDialogDashboard
              title="Supprimer la note"
              description={`Êtes-vous sûr de vouloir supprimer cette note de ${grade.value}/20 pour ${grade.student?.firstName} ${grade.student?.lastName} ? Cette action est irréversible.`}
              onConfirm={() => onDelete(grade.id)}
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
