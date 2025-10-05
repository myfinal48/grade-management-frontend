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
import { useCreateGrade, useUpdateGrade } from "@/hooks/useGrades"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStaffByRole } from "@/hooks/useStaff"
import { UserRoles } from "@/types"
import { useCoursesByTeacher } from "@/hooks/useCourses"
import type { Course } from "@/types/course"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

const gradeSchema = z.object({
  studentId: z.coerce.number().min(1, "L'étudiant est requis"),
  courseId: z.coerce.number().min(1, "Le cours est requis"),
  value: z.coerce.number()
    .min(0, "La note ne peut pas être négative")
    .max(20, "La note ne peut pas dépasser 20"),
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface GradeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<GradeFormData>
  mode: "create" | "edit"
  gradeId?: number
}

export function GradeForm({ open, onOpenChange, initialData, mode, gradeId }: Readonly<GradeFormProps>) {
  const { data: session } = useSession()
  const teacherId = session?.user?.id ? Number(session.user.id) : 0
  
  const createGradeMutation = useCreateGrade()
  const updateGradeMutation = useUpdateGrade()
  const { data: courses, isLoading: isCoursesLoading } = useCoursesByTeacher({ teacherId })
  const [formError, setFormError] = useState<string | null>(null)
  const { data: students, isLoading: isStudentsLoading } = useStaffByRole(UserRoles.STUDENT, open)

  const coursesList = courses || []

  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: initialData?.studentId ?? 0,
      courseId: initialData?.courseId ?? 0,
      value: initialData?.value ?? 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        studentId: initialData.studentId ?? 0,
        courseId: initialData.courseId ?? 0,
        value: initialData.value ?? 0,
      });
    } else {
      form.reset({
        studentId: 0,
        courseId: 0,
        value: 0,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: GradeFormData) => {
    setFormError(null)
    try {
      if (mode === "create") {
        await createGradeMutation.mutateAsync(data)
      } else if (gradeId) {
        await updateGradeMutation.mutateAsync({ id: gradeId, data })
      }
      onOpenChange(false)
      form.reset()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        setFormError((error as { message?: string }).message || "Une erreur est survenue. Veuillez réessayer.")
      } else {
        setFormError("Une erreur est survenue. Veuillez réessayer.")
      }
    }
  }

  const isLoading = createGradeMutation.isPending || updateGradeMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Ajouter une note" : "Modifier la note"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Remplissez le formulaire pour ajouter une nouvelle note."
              : "Modifiez les informations de la note."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Étudiant</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={isStudentsLoading || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className={`w-full truncate ${fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionner un étudiant" className="truncate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isStudentsLoading ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </div>
                      ) : students && students.length > 0 ? (
                        students.map((student) => (
                          <SelectItem key={student.id} value={String(student.id)}>
                            {student.firstName} {student.lastName} ({student.email})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground text-sm">Aucun étudiant disponible</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Cours</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={isCoursesLoading || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className={`w-full truncate ${fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionner un cours" className="truncate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isCoursesLoading ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </div>
                      ) : coursesList.length > 0 ? (
                        coursesList.map((course: Course) => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.name} ({course.code})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground text-sm">Aucun cours disponible</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Note sur 20"
                      min="0"
                      max="20"
                      step={0.01}
                      {...field}
                      className={fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : mode === "create" ? "Créer" : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 