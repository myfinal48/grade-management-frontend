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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import type { GradeResponseData } from "@/types/grade"
import { useCreateGrade, useUpdateGrade } from "@/hooks/useGrades"
import { useUsers } from "@/hooks/useUsers"
import { useCourses } from "@/hooks/useCourses"
import { UserRoles } from "@/types"
import type { User } from "@/types/user"
import type { Course } from "@/types/course"

const gradeSchema = z.object({
  studentId: z.coerce.number().min(1, "L'étudiant est requis"),
  courseId: z.coerce.number().min(1, "Le cours est requis"),
  value: z.coerce.number().min(0, "La note doit être supérieure ou égale à 0").max(20, "La note doit être inférieure ou égale à 20"),
})

type GradeFormData = z.infer<typeof gradeSchema>

interface GradeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grade?: GradeResponseData
  mode: "create" | "edit"
}

export function GradeForm({ open, onOpenChange, grade, mode }: Readonly<GradeFormProps>) {
  const createGrade = useCreateGrade()
  const updateGrade = useUpdateGrade()
  const usersQuery = useUsers(UserRoles.STUDENT)
  const students = usersQuery.data as User[]
  const studentsLoading = usersQuery.isPending || usersQuery.isLoading
  const coursesQuery = useCourses()
  const courses = coursesQuery.data as Course[]
  const coursesLoading = coursesQuery.isPending || coursesQuery.isLoading

  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: 0,
      courseId: 0,
      value: 0,
    },
  })

  useEffect(() => {
    if (grade) {
      form.reset({
        studentId: grade.student?.id || 0,
        courseId: grade.course?.id || 0,
        value: grade.value || 0,
      })
    } else {
      form.reset({
        studentId: 0,
        courseId: 0,
        value: 0,
      })
    }
  }, [grade, form])

  const onSubmit = async (data: GradeFormData) => {
    if (mode === "create") {
      await createGrade.mutateAsync(data)
    } else if (grade) {
      await updateGrade.mutateAsync({ id: grade.id, data })
    }
    onOpenChange(false)
    form.reset()
  }

  const isLoading = createGrade.isPending || updateGrade.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Ajouter une note" : "Modifier la note"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Créer une nouvelle note pour un étudiant." 
              : "Modifier les informations de cette note."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Étudiant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                    disabled={isLoading || studentsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder="Sélectionner un étudiant" className="truncate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cours</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                    disabled={isLoading || coursesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder="Sélectionner un cours" className="truncate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                          {course.code && (
                            <span className="text-muted-foreground ml-2">
                              ({course.code})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (sur 20)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      placeholder="Entrer la note"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? "Enregistrement..." 
                  : mode === "create" 
                    ? "Créer" 
                    : "Mettre à jour"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
