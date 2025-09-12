"use client"

import { useState } from "react"
import { useUsers, useDeleteUser } from "@/hooks/useUsers"
import { UsersHeader } from "./UsersHeader"
import { UsersLoading } from "./UsersLoading"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { UserForm } from "./UserForm"
import type { User } from "@/types/user"

export function AdminUsers() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  if (isLoading) {
    return <UsersLoading />
  }

  return (
    <div className="space-y-6">
      <UsersHeader />
      <DataTable 
        columns={columns} 
        data={users || []}
        meta={{
          onEdit: (u: User) => setEditingUser(u),
          onDelete: (u: User) => deleteUser.mutate(u.id),
        }}
      />

      {editingUser && (
        <UserForm 
          open={!!editingUser}
          onOpenChange={(open: boolean) => !open && setEditingUser(null)}
          user={editingUser}
          mode="edit"
        />
      )}
    </div>
  )
}
