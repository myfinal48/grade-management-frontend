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
import type { Course } from "@/types/course"
import { useCourses } from "@/hooks/useCourses"

interface DeleteCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course
}

export function DeleteCourseDialog({ open, onOpenChange, course }: DeleteCourseDialogProps) {
  const { deleteCourse } = useCourses({ courseId: course.id })

  const handleDelete = async () => {
      await deleteCourse.mutateAsync(course.id)
      onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the course <strong>&quot;{course.name}&quot;</strong> from
            the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCourse.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCourse.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteCourse.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 