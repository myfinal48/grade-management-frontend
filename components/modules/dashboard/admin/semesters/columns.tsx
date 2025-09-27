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
import { SemesterDetails } from "./SemesterDetails"
import { AlertDialogDashboard } from "@/components/global"
import type { Semester } from "@/types/semester"
import { formatDate } from "@/lib/utils"

export const columns: ColumnDef<Semester>[] = [
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
  },
  {
    accessorKey: "universityYear",
    header: "Année universitaire",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.universityYear}</Badge>
    ),
  },
  {
    accessorKey: "levelName",
    header: "Niveau",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.levelName || "Non assigné"}</div>
    ),
    filterFn: (row, id, value) => {
      const levelName = row.original.levelName || "Non assigné"
      return levelName.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "startDate",
    header: "Date de début",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"))
      return <div>{formatDate(date)}</div>
    },
  },
  {
    accessorKey: "endDate",
    header: "Date de fin",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"))
      return <div>{formatDate(date)}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const semester = row.original
      const meta = table.options.meta as {
        onEdit?: (semester: Semester) => void
        onDelete?: (semester: Semester) => void
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
            <SemesterDetails semester={semester}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Eye className="mr-2 h-4 w-4" />
                Détails
              </DropdownMenuItem>
            </SemesterDetails>
            <DropdownMenuItem onClick={() => meta?.onEdit?.(semester)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogDashboard
              title="Supprimer le semestre"
              description={`Êtes-vous sûr de vouloir supprimer le semestre "${semester.name}" ? Cette action est irréversible.`}
              onConfirm={() => meta?.onDelete?.(semester)}
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
