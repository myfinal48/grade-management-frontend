import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

export const templateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom doit faire moins de 100 caractères"),
  recipient: z.string().min(1, "Le sujet est requis").max(200, "Le sujet doit faire moins de 200 caractères"),
  body: z.string().min(1, "Le contenu est requis").max(5000, "Le contenu doit faire moins de 5000 caractères"),
  variableInput: z.string().optional(),
})

export type TemplateFormData = z.infer<typeof templateSchema>;

export function useEmailTemplateForm(defaultValues: TemplateFormData) {
  return useForm({
    resolver: zodResolver(templateSchema),
    defaultValues,
  })
} 