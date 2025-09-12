"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { University } from "@/types/university"
import { useCreateUniversity, useUpdateUniversity } from "@/hooks/useUniversities"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import Image from "next/image";


const universitySchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(200, "Le nom doit faire moins de 200 caractères"),
  address: z.string().min(1, "L'adresse est requise").max(500, "L'adresse doit faire moins de 500 caractères"),
  phone: z.string().min(1, "Le téléphone est requis").max(20, "Le téléphone doit faire moins de 20 caractères"),
  website: z.string().min(1, "Le site web est requis").max(200, "Le site web doit faire moins de 200 caractères"),
})

type UniversityFormData = z.infer<typeof universitySchema>

interface UniversityFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  university?: University
  mode: "create" | "edit"
}

export function UniversityForm({ open, onOpenChange, university, mode }: Readonly<UniversityFormProps>) {
  const createUniversity = useCreateUniversity()
  const updateUniversity = useUpdateUniversity()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UniversityFormData>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      name: university?.name ?? "",
      address: university?.address ?? "",
      phone: university?.phone ?? "",
      website: university?.website ?? "",
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille du fichier ne doit pas dépasser 5MB")
        return
      }

      setSelectedFile(file)

      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: UniversityFormData) => {
      if (mode === "create") {
        await createUniversity.mutateAsync({
          ...data,
          logo: selectedFile || undefined,
        })
      } else if (university) {
        await updateUniversity.mutateAsync({
          id: university.id,
          ...data,
          logo: selectedFile || undefined,
        })
      }
      onOpenChange(false)
      form.reset()
      removeFile()
    
  }

  const isLoading = createUniversity.isPending || updateUniversity.isPending

  const currentLogoUrl =
    university?.logoUrl && !selectedFile ? `https://${university.logoUrl}` : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Créer une Nouvelle Université" : "Modifier l'Université"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajouter une nouvelle université au système."
              : "Modifier les informations de l'université."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l&qpos;Université</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrer le nom de l'université" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Entrer l'adresse complète" className="resize-none" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+237 6 XX XX XX XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Web</FormLabel>
                    <FormControl>
                      <Input placeholder="www.universite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>{"Logo de l'Université"}</FormLabel>

              {(previewUrl || currentLogoUrl) && (
                <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                  <Image src={previewUrl ?? currentLogoUrl ?? ""} alt="Logo" width={128} height={128} className="w-full h-full object-cover pointer-events-none select-none" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 z-10"
                    onClick={removeFile}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full h-24"
                >
                  <Upload className="h-4 w-4" />
                  {selectedFile || currentLogoUrl ? "Changer le Logo" : "Télécharger un Logo"}
                </Button>
                {selectedFile && <span className="text-sm text-muted-foreground">{selectedFile.name}</span>}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              <p className="text-xs text-muted-foreground">Formats acceptés: JPG, PNG, GIF. Taille max: 5MB</p>
            </div>

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
