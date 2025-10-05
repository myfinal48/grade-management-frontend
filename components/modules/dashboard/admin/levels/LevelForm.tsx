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
import type { Level } from "@/types/level"
import { useCreateLevel, useUpdateLevel } from "@/hooks/useLevels"
import { useMajors } from "@/hooks/useMajors"

const levelSchema = z.object({
  name: z.string().min(2, "Le nom est requis (min 2 caractères)").max(100, "Le nom doit contenir moins de 100 caractères"),
  majorId: z.coerce.number().min(1, "La filière est requise"),
})

type LevelFormData = z.infer<typeof levelSchema>

interface LevelFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level?: Level
  mode: "create" | "edit"
}

export function LevelForm({ open, onOpenChange, level, mode }: Readonly<LevelFormProps>) {
  const createLevel = useCreateLevel()
  const updateLevel = useUpdateLevel()
  const { data: majors } = useMajors()

  const form = useForm<LevelFormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      name: "",
      majorId: undefined,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: level?.name || "",
        majorId: level?.majorId,
      })
    }
  }, [open, level, form])

  const onSubmit = async (data: LevelFormData) => {
    if (mode === "create") {
      await createLevel.mutateAsync({ majorId: data.majorId, data })
    } else if (level) {
      await updateLevel.mutateAsync({ id: level.id, data })
    }
    onOpenChange(false)
  }

  const isLoading = createLevel.isPending || updateLevel.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer un nouveau niveau" : "Modifier le niveau"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajouter un nouveau niveau au système."
              : "Modifier les informations du niveau."}
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
                    <Input placeholder="Saisir le nom du niveau" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="majorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filière</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une filière" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {majors?.map((major) => (
                        <SelectItem key={major.id} value={major.id.toString()}>
                          {major.name}
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
