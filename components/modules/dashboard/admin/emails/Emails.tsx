"use client"

import { useState } from "react"
import { EmailsHeader } from "@/components/modules/dashboard/admin/emails/EmailsHeader"
import { EmailForm } from "@/components/modules/dashboard/admin/emails/EmailForm"
import { EmailHistory } from "@/components/modules/dashboard/admin/emails/EmailHistory"
import { EmailTemplates } from "@/components/modules/dashboard/admin/emails/EmailTemplates"

export function Emails() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"send" | "history" | "templates">("send")

  return (
    <div className="space-y-6">
      <EmailsHeader activeTab={activeTab} onTabChange={setActiveTab} onNewEmail={() => setShowEmailForm(true)} />

      {activeTab === "send" && (
        <div className="grid gap-6">
          <EmailForm open={showEmailForm} onOpenChange={setShowEmailForm} />
          {!showEmailForm && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mx-auto max-w-md">
                <h3 className="text-lg font-semibold">Prêt à envoyer des emails</h3>
                <p className="text-muted-foreground">
                  Cliquez sur &apos;Nouveau Email&apos; pour commencer à rédiger un message.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && <EmailHistory />}
      {activeTab === "templates" && <EmailTemplates />}
    </div>
  )
}
