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
import type { Semester } from "@/types/semester"
import { useCreateSemester, useUpdateSemester } from "@/hooks/useSemesters"
import { useLevels } from "@/hooks/useLevels"

const semesterSchema = z
  .object({
    name: z.string().min(2, "Le nom est requis (min 2 caractères)").max(100, "Le nom doit contenir moins de 100 caractères"),
    startDate: z.string().min(1, "La date de début est requise"),
    endDate: z.string().min(1, "La date de fin est requise"),
    universityYear: z
      .string()
      .min(1, "L'année universitaire est requise")
      .max(50, "L'année universitaire doit contenir moins de 50 caractères"),
    levelId: z.coerce.number().min(1, "Le niveau est requis"),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  })

type SemesterFormData = z.infer<typeof semesterSchema>

interface SemesterFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  semester?: Semester
  mode: "create" | "edit"
}

export function SemesterForm({ open, onOpenChange, semester, mode }: Readonly<SemesterFormProps>) {
  const createSemester = useCreateSemester()
  const updateSemester = useUpdateSemester()
  const { data: levels } = useLevels()

  const form = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      universityYear: "",
      levelId: 0,
    },
  })

  useEffect(() => {
    if (open) {
      if (semester) {
        form.reset({
          name: semester.name || "",
          startDate: semester.startDate || "",
          endDate: semester.endDate || "",
          universityYear: semester.universityYear || "",
          levelId: semester.levelId || 0,
        })
      } else {
        form.reset({
          name: "",
          startDate: "",
          endDate: "",
          universityYear: "",
          levelId: 0,
        })
      }
    }
  }, [semester, form, open])

  const onSubmit = async (data: SemesterFormData) => {
      if (mode === "create") {
        await createSemester.mutateAsync({ levelId: data.levelId, data })
      } else if (semester) {
        await updateSemester.mutateAsync({ id: semester.id, data })
      }
      onOpenChange(false)
      form.reset()
  }

  const isLoading = createSemester.isPending || updateSemester.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Créer un nouveau semestre" : "Modifier le semestre"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Ajouter un nouveau semestre au système." : "Modifier les informations du semestre."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le nom du semestre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="universityYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année universitaire</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 2024-2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels?.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.name}
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
