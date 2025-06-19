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
import type { Semester } from "@/types/semester"
import { useDeleteSemester } from "@/hooks/useSemesters"

interface DeleteSemesterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  semester: Semester
}

export function DeleteSemesterDialog({ open, onOpenChange, semester }: DeleteSemesterDialogProps) {
  const deleteSemester = useDeleteSemester()

  const handleDelete = async () => {
    try {
      await deleteSemester.mutateAsync(semester.id)
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
            This action cannot be undone. This will permanently delete the semester <strong>"{semester.name}"</strong>{" "}
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSemester.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSemester.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteSemester.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
