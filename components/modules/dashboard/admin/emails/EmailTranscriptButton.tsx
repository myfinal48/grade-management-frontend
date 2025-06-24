"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { EmailForm } from "@/components/modules/dashboard/admin/emails/EmailForm"
import type { Transcript } from "@/types/transcript"

interface EmailTranscriptButtonProps {
  transcript: Transcript
  pdfFile?: File
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function EmailTranscriptButton({
  transcript,
  pdfFile,
  variant = "outline",
  size = "sm",
}: EmailTranscriptButtonProps) {
  const [showEmailForm, setShowEmailForm] = useState(false)

  // Generate default email content
  const defaultSubject = `Relevé de notes - ${transcript.name} - ${transcript.semester} ${transcript.universityYear}`
  const defaultBody = `Bonjour ${transcript.name},

Veuillez trouver ci-joint votre relevé de notes pour le semestre ${transcript.semester} de l'année universitaire ${transcript.universityYear}.

Informations du relevé :
- Filière : ${transcript.major}
- Niveau : ${transcript.level}
- Moyenne générale : ${transcript.averageGenerale.toFixed(2)}
- Mention : ${transcript.generalMention}
- Résultat : ${transcript.result}

Cordialement,
L'administration académique`

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setShowEmailForm(true)}>
        <Mail className="mr-2 h-4 w-4" />
        Envoyer par Email
      </Button>

      <EmailForm
        open={showEmailForm}
        onOpenChange={setShowEmailForm}
        defaultSubject={defaultSubject}
        defaultBody={defaultBody}
        defaultFile={pdfFile}
      />
    </>
  )
}
