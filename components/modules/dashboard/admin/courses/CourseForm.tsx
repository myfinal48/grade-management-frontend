"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { CourseRequestData } from "@/types/course"
import { useCourses } from "@/hooks/useCourses"
import { useState, useEffect } from "react"
import { useSemesters } from "@/hooks/useSemesters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormLoadingState, FormErrorState } from "@/components/global"

const courseSchema = z.object({
  code: z.string().min(1, "Code is required").max(20, "Code must be less than 20 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  credit: z.coerce.number().min(1, "Credit is required").max(100, "Credit must be less than 100"),
  semesterId: z.coerce.number().min(1, "Semester is required"),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: CourseRequestData & { id?: number }
  mode: "create" | "edit"
}

export function CourseForm({ open, onOpenChange, course, mode }: CourseFormProps) {
  const { createCourse, updateCourse } = useCourses({ courseId: course?.id })
  const [formError, setFormError] = useState<string | null>(null)
  const { data: semesters, isLoading: semestersLoading, error: semestersError } = useSemesters()

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      credit: 1,
      semesterId: 1,
    },
  })

  useEffect(() => {
    if (course) {
      form.reset({
        code: course.code || "",
        name: course.name || "",
        description: course.description || "",
        credit: course.credit ?? 1,
        semesterId: course.semesterId ?? 1,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        description: "",
        credit: 1,
        semesterId: 1,
      })
    }
  }, [course, form])

  const onSubmit = async (data: CourseFormData) => {
    setFormError(null)
    try {
      if (mode === "create") {
        await createCourse.mutateAsync(data)
      } else if (course) {
        await updateCourse.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        setFormError((error as { message?: string }).message || "An error occurred. Please try again.")
      } else {
        setFormError("An error occurred. Please try again.")
      }
    }
  }

  const isLoading = createCourse.isPending || updateCourse.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Course" : "Edit Course"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Add a new course to the system." : "Make changes to the course information."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter course credit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semesterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    {semestersLoading ? (
                      <FormLoadingState message="Chargement des semestres..." />
                    ) : semestersError ? (
                      <FormErrorState message="Erreur lors du chargement des semestres" />
                    ) : (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters?.map((semester) => (
                            <SelectItem key={semester.id} value={String(semester.id)}>
                              {semester.name} - {semester.universityYear}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formError && (
              <div className="text-destructive text-sm font-medium text-center">
                {formError}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 