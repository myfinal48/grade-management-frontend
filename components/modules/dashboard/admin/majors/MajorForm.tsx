"use client"
import { useEffect } from "react"
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
import type { Major } from "@/types/major"
import { useCreateMajor, useUpdateMajor } from "@/hooks/useMajors"

const majorSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom doit contenir moins de 100 caractères"),
  description: z.string().min(10, "La description est requise (min. 10 caractères)").max(100, "La description doit contenir moins de 100 caractères"),
})

type MajorFormData = z.infer<typeof majorSchema>

interface MajorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  major?: Major
  mode: "create" | "edit"
}

export function MajorForm({ open, onOpenChange, major, mode }: Readonly<MajorFormProps>) {
  const createMajor = useCreateMajor()
  const updateMajor = useUpdateMajor()

  const form = useForm<MajorFormData>({
    resolver: zodResolver(majorSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: major?.name || "",
        description: major?.description || "",
      })
    }
  }, [open, major, form])

  const onSubmit = async (data: MajorFormData) => {
    if (mode === "create") {
      await createMajor.mutateAsync(data)
    } else if (major) {
      await updateMajor.mutateAsync({ id: major.id, data })
    }
    onOpenChange(false)
    form.reset()
  }

  const isLoading = createMajor.isPending || updateMajor.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer une nouvelle filière" : "Modifier la filière"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Ajouter une nouvelle filière au système." 
              : "Modifier les informations de la filière."}
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
                    <Input placeholder="Saisir le nom de la filière" {...field} />
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
                    <Textarea 
                      placeholder="Saisir la description de la filière" 
                      className="resize-none" 
                      rows={3} 
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
                    : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
