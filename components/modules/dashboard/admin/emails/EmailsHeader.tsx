"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Plus, History } from "lucide-react"

type TabValue = "send" | "history" | "templates"

interface EmailsHeaderProps {
  activeTab: TabValue
  onTabChange: (tab: TabValue) => void
  onNewEmail: () => void
}

export function EmailsHeader({ activeTab, onTabChange, onNewEmail }: EmailsHeaderProps) {
  const handleTabChange = (value: string) => {
    onTabChange(value as TabValue)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="h-8 w-8" />
          Gestion des Emails
        </h1>
        <p className="text-muted-foreground">Envoyer des emails aux étudiants et gérer les communications</p>
      </div>

      <div className="flex items-center gap-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Envoyer
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "send" && (
          <Button onClick={onNewEmail}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Email
          </Button>
        )}
      </div>
    </div>
  )
}
