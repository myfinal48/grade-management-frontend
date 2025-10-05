"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { University } from "@/types/university"
import { AlertDialogDashboard } from "@/components/global"
import { UniversityDetails } from "./UniversityDetails"

export const columns: ColumnDef<University>[] = [
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
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-muted-foreground">
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "website",
    header: "Site Web",
    cell: ({ row }) => {
      const website: string | undefined = row.getValue("website")
      const normalized = website
        ? website.startsWith("http://") || website.startsWith("https://")
          ? website
          : `https://${website}`
        : ""
      return website ? (
        <a
          href={normalized}
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-[200px] truncate text-primary underline-offset-2 hover:underline"
          title={website}
        >
          {website}
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const university = row.original
      const meta = table.options.meta as {
        onEdit?: (u: University) => void
        onDelete?: (u: University) => void
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
            <UniversityDetails university={university}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Eye className="mr-2 h-4 w-4" />
                Détails
              </DropdownMenuItem>
            </UniversityDetails>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.onEdit?.(university)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <AlertDialogDashboard
              title="Supprimer l'université"
              description={`Êtes-vous sûr de vouloir supprimer l'université "${university.name}" ? Cette action est irréversible.`}
              onConfirm={() => meta?.onDelete?.(university)}
            >
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="text-destructive"
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
