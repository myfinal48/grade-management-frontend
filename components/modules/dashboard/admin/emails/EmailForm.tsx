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
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, Paperclip, X, Upload } from "lucide-react"
import { useSendSimpleEmail, useSendEmailWithAttachment } from "@/hooks/useEmails"
import { toast } from "sonner"

const emailSchema = z.object({
  to: z.string().email("Adresse email invalide"),
  subject: z.string().min(1, "Le sujet est requis").max(200, "Le sujet doit faire moins de 200 caractères"),
  body: z.string().min(1, "Le contenu est requis").max(5000, "Le contenu doit faire moins de 5000 caractères"),
  withAttachment: z.boolean().default(false),
})

type EmailFormData = z.infer<typeof emailSchema>

interface EmailFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTo?: string
  defaultSubject?: string
  defaultBody?: string
  defaultFile?: File
}

export function EmailForm({
  open,
  onOpenChange,
  defaultTo = "",
  defaultSubject = "",
  defaultBody = "",
  defaultFile,
}: EmailFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(defaultFile || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sendSimpleEmail = useSendSimpleEmail()
  const sendEmailWithAttachment = useSendEmailWithAttachment()

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      to: defaultTo,
      subject: defaultSubject,
      body: defaultBody,
      withAttachment: !!defaultFile,
    },
  })

  const withAttachment = form.watch("withAttachment")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error("La taille du fichier ne doit pas dépasser 25MB")
        return
      }
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: EmailFormData) => {
    try {
      if (data.withAttachment) {
        if (!selectedFile) {
          toast.error("Veuillez sélectionner un fichier à attacher")
          return
        }

        await sendEmailWithAttachment.mutateAsync({
          to: data.to,
          subject: data.subject,
          body: data.body,
          file: selectedFile,
        })
      } else {
        await sendSimpleEmail.mutateAsync({
          to: data.to,
          subject: data.subject,
          body: data.body,
        })
      }

      onOpenChange(false)
      form.reset()
      setSelectedFile(null)
    } catch (error) {
      console.error("Email sending error:", error)
    }
  }

  const isLoading = sendSimpleEmail.isPending || sendEmailWithAttachment.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer un Email
          </DialogTitle>
          <DialogDescription>Envoyer un email simple ou avec pièce jointe</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinataire</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="etudiant@univ.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input placeholder="Relevé de notes semestriel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Veuillez trouver votre relevé en pièce jointe."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="withAttachment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ajouter une pièce jointe</FormLabel>
                    <div className="text-sm text-muted-foreground">Joindre un fichier à l&apos;email</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {withAttachment && (
              <div className="space-y-2">
                <FormLabel>Fichier à joindre</FormLabel>

                {selectedFile && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm flex-1">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">({Math.round(selectedFile.size / 1024)} KB)</span>
                    <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {selectedFile ? "Changer le fichier" : "Sélectionner un fichier"}
                  </Button>
                </div>

                <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

                <p className="text-xs text-muted-foreground">Taille maximum: 25MB</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Envoyer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
  
}
