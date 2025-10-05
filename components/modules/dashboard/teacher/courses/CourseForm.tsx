"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateCourse, useUpdateCourse } from "@/hooks/useCourses"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSemesters } from "@/hooks/useSemesters"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
 

const courseSchema = z.object({
  name: z.string().min(1, "Le nom du cours est requis"),
  code: z.string().min(1, "Le code du cours est requis"),
  credit: z.coerce.number().min(1, "Le nombre de crédits doit être au moins 1"),
  description: z.string().optional(),
  semesterId: z.coerce.number().min(1, "Le semestre est requis"),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<CourseFormData> & { semesterName?: string }
  mode: "create" | "edit"
  courseId?: number
}

export function CourseForm({ open, onOpenChange, initialData, mode, courseId }: Readonly<CourseFormProps>) {
  const createCourseMutation = useCreateCourse()
  const updateCourseMutation = useUpdateCourse()
  const { data: semesters, isLoading: isSemestersLoading } = useSemesters()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      code: initialData?.code ?? "",
      credit: initialData?.credit ?? 1,
      description: initialData?.description ?? "",
      semesterId: initialData?.semesterId ?? 0,
    },
  })

  const isLoading = createCourseMutation.isPending || updateCourseMutation.isPending

  useEffect(() => {
    if (open) {
      if (initialData) {
        let semesterId = initialData.semesterId ?? 0
        if (!semesterId && initialData.semesterName && semesters) {
          const matchingSemester = semesters.find(s => s.name === initialData.semesterName)
          semesterId = matchingSemester?.id ?? 0
        }
        
        form.reset({
          name: initialData.name ?? "",
          code: initialData.code ?? "",
          credit: initialData.credit ?? 1,
          description: initialData.description ?? "",
          semesterId: semesterId,
        })
      } else {
        form.reset({
          name: "",
          code: "",
          credit: 1,
          description: "",
          semesterId: 0,
        })
      }
    }
  }, [open, initialData, form, semesters])

  const onSubmit = async (data: CourseFormData) => {
    try {
      setFormError(null)
      
      if (mode === "create") {
        await createCourseMutation.mutateAsync({
          ...data,
          description: data.description ?? "",
        })
      } else if (mode === "edit" && courseId) {
        await updateCourseMutation.mutateAsync({ 
          id: courseId, 
          data: { 
            ...data, 
            description: data.description ?? "",
          } 
        })
      }
      
      onOpenChange(false)
      form.reset()
    } catch {
      setFormError("Une erreur est survenue lors de l'enregistrement")
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      setFormError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer un cours" : "Modifier le cours"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Ajoutez un nouveau cours à votre liste"
              : "Modifiez les informations du cours"
            }
          </DialogDescription>
        </DialogHeader>
        
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du cours</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mathématiques avancées" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code du cours</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: MATH101" {...field} />
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
                    <Input type="number" min="1" placeholder="3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semesterId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Semestre</FormLabel>
                  <Select
                    value={field.value && field.value !== 0 ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={isSemestersLoading || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className={`w-full ${fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionner un semestre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isSemestersLoading ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </div>
                      ) : semesters && semesters.length > 0 ? (
                        semesters.map((semester) => (
                          <SelectItem key={semester.id} value={String(semester.id)}>
                            {semester.name} - {semester.universityYear}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground text-sm">
                          Aucun semestre disponible
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description du cours..."
                      className="resize-none"
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
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Créer" : "Modifier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
