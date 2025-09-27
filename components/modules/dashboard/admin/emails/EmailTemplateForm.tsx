"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, X } from "lucide-react"
import { useCreateEmailTemplate, useUpdateEmailTemplate } from "@/hooks/useEmails"
import type { EmailTemplate } from "@/types/email"
import { useEmailTemplateForm, type TemplateFormData } from "@/hooks/useEmailTemplateForm"


interface EmailTemplateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: EmailTemplate
  mode: "create" | "edit"
}

export function EmailTemplateForm({ open, onOpenChange, template, mode }: Readonly<EmailTemplateFormProps>) {
  const [variables, setVariables] = useState<string[]>(template?.variables || [])

  const createTemplate = useCreateEmailTemplate()
  const updateTemplate = useUpdateEmailTemplate()

  const form = useEmailTemplateForm({
    name: template?.name ?? "",
    subject: template?.subject ?? "",
    body: template?.body ?? "",
    variableInput: "",
  })

  const addVariable = () => {
    const variableInput = form.getValues("variableInput")
    const variable = variableInput?.trim()
    if (variable && !variables.includes(variable)) {
      setVariables([...variables, variable])
      form.setValue("variableInput", "")
    }
  }

  const removeVariable = (variable: string) => {
    setVariables(variables.filter((v) => v !== variable))
  }

  const onSubmit = async (data: TemplateFormData) => {
      if (mode === "create") {
        await createTemplate.mutateAsync({
          name: data.name,
          subject: data.subject,
          body: data.body,
          variables,
        })
      } else if (template) {
        await updateTemplate.mutateAsync({
          id: template.id,
          name: data.name,
          subject: data.subject,
          body: data.body,
          variables,
        })
      }
      onOpenChange(false)
      form.reset()
      setVariables([])
   
  }

  const isLoading = createTemplate.isPending || updateTemplate.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {mode === "create" ? "Créer un Modèle d'Email" : "Modifier le Modèle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Créer un nouveau modèle d'email réutilisable"
              : "Modifier les informations du modèle d'email"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du Modèle</FormLabel>
                  <FormControl>
                    <Input placeholder="Relevé de notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input placeholder="Relevé de notes - {{semester}} {{year}}" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu du Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bonjour {{studentName}},&#10;&#10;Veuillez trouver ci-joint votre relevé de notes...&#10;&#10;Cordialement,&#10;L'administration"
                      className="resize-none"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="variableInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variables (optionnel)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="studentName"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addVariable()
                            }
                          }}
                        />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={addVariable}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {variables.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Variables définies:</p>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                        {`{{${variable}}}`}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeVariable(variable)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
