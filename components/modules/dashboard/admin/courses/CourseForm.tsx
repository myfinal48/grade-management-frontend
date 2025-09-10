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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import type { Course } from "@/types/course"
import { useCourses } from "@/hooks/useCourses"
import { useSemesters } from "@/hooks/useSemesters"
import { useUsers } from "@/hooks/useUsers"
import { UserRoles, type UserResponseData } from "@/types"

const courseSchema = z.object({
  code: z.string().min(2, "Le code est requis (min 2 caractères)").max(20, "Le code doit contenir moins de 20 caractères"),
  name: z.string().min(2, "Le nom est requis (min 2 caractères)").max(100, "Le nom doit contenir moins de 100 caractères"),
  description: z.string().min(10, "La description est requise (min 10 caractères)").max(500, "La description doit contenir moins de 500 caractères"),
  credit: z.coerce.number().min(1, "Le crédit est requis").max(100, "Le crédit doit être inférieur à 100"),
  semesterId: z.coerce.number().min(1, "Le semestre est requis"),
  teacherId: z.coerce.number().optional().nullable(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: Course
  mode: "create" | "edit"
}

export function CourseForm({ open, onOpenChange, course, mode }: Readonly<CourseFormProps>) {
  const { createCourse, updateCourse } = useCourses({ courseId: course?.id })
  const { data: semesters, isPending: semestersLoading } = useSemesters()
  const { getUsers } = useUsers({ role: UserRoles.TEACHER })
  const { data: teachers, isLoading: teachersLoading } = getUsers

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      credit: 1,
      semesterId: 1,
      teacherId: null,
    },
  })

  useEffect(() => {
    if (course) {
      const inferredSemesterId = (() => {
        if (course.semesterId) return course.semesterId
        const match = semesters?.find((s) => s.name === course.semesterName)
        return match ? match.id : 1
      })()

      form.reset({
        code: course.code || "",
        name: course.name || "",
        description: course.description || "",
        credit: course.credit ?? 1,
        semesterId: inferredSemesterId,
        teacherId: course.teacherId ?? null,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        description: "",
        credit: 1,
        semesterId: 1,
        teacherId: null,
      })
    }
  }, [course, semesters, form])

  const onSubmit = async (data: CourseFormData) => {
    if (mode === "create") {
      await createCourse.mutateAsync(data)
    } else if (course) {
      await updateCourse.mutateAsync(data)
    }
    onOpenChange(false)
    form.reset()
  }

  const isLoading = createCourse.isPending || updateCourse.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Créer un nouveau cours" : "Modifier le cours"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Ajouter un nouveau cours au système." : "Modifier les informations du cours."}
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
                    <Input placeholder="Entrer le code du cours" {...field} />
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
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrer le nom du cours" {...field} />
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
                    <Input placeholder="Entrer la description du cours" {...field} />
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
                  <FormLabel>Crédits</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Entrer le nombre de crédits" {...field} />
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
                  <FormLabel>Semestre</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    value={field.value?.toString() || ""}
                    disabled={isLoading || semestersLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un semestre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesters?.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id.toString()}>
                          {semester.name} - {semester.universityYear}
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
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professeur</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? null : Number.parseInt(value))}
                    value={field.value?.toString() || "none"}
                    disabled={isLoading || teachersLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un professeur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun professeur assigné</SelectItem>
                      {teachers?.map((teacher: UserResponseData) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : mode === "create" ? "Créer" : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 