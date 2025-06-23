"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { University } from "@/types/university"
import { useDeleteUniversity } from "@/hooks/useUniversities"

interface DeleteUniversityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  university: University
}

export function DeleteUniversityDialog({ open, onOpenChange, university }: Readonly<DeleteUniversityDialogProps>) {
  const deleteUniversity = useDeleteUniversity()

  const handleDelete = async () => {
    try {
      await deleteUniversity.mutateAsync(university.id)
      onOpenChange(false)
    } catch (error) {
        console.error("Failed to delete university:", error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement l&apos;université{" "}
            <strong>{university.name}</strong> du système.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUniversity.isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUniversity.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUniversity.isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
