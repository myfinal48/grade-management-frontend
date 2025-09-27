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
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/user"
import { AlertDialogDashboard } from "@/components/global"
import { UserDetails } from "./UserDetails"
import { UserRoles } from "@/types"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
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
      <div className="font-medium">
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate text-muted-foreground">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Nom d'utilisateur",
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.getValue("username")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role: string = row.getValue("role")
      return (
        <Badge 
          variant={
            role === UserRoles.ADMIN 
              ? "destructive" 
              : role === UserRoles.TEACHER 
              ? "default" 
              : "secondary"
          }
        >
          {role}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original
      const meta = table.options.meta as {
        onEdit?: (u: User) => void
        onDelete?: (u: User) => void
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
            <UserDetails user={user}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Eye className="mr-2 h-4 w-4" />
                Détails
              </DropdownMenuItem>
            </UserDetails>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.onEdit?.(user)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {user.role !== UserRoles.ADMIN && (
              <AlertDialogDashboard
                title="Supprimer l'utilisateur"
                description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.firstName} ${user.lastName}" ? Cette action est irréversible.`}
                onConfirm={() => meta?.onDelete?.(user)}
              >
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogDashboard>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
