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
import type { Major } from "@/types/major"
import { useDeleteMajor } from "@/hooks/useMajors"

interface DeleteMajorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  major: Major
}

export function DeleteMajorDialog({ open, onOpenChange, major }: DeleteMajorDialogProps) {
  const deleteMajor = useDeleteMajor()

  const handleDelete = async () => {
    try {
      await deleteMajor.mutateAsync(major.id)
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the major <strong>"{major.name}"</strong> from
            the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMajor.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMajor.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMajor.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
