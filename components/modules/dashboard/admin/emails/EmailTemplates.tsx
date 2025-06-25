"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileText, Plus, MoreHorizontal, Edit, Trash2, RefreshCw, XCircle } from "lucide-react"
import { useEmailTemplates, useDeleteEmailTemplate } from "@/hooks/useEmails"
import { EmailTemplateForm } from "./EmailTemplateForm"
import type { EmailTemplate } from "@/types/email"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { StatsSkeleton } from "@/components/ui/loading-skeletons"

export function EmailTemplates() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<EmailTemplate | null>(null)

  const { data: templates, isLoading, error, refetch } = useEmailTemplates()
  const deleteTemplate = useDeleteEmailTemplate()

  const handleDelete = async () => {
    if (deletingTemplate) {
      try {
        await deleteTemplate.mutateAsync(deletingTemplate.id)
        setDeletingTemplate(null)
      } catch (error) {
        console.error("Delete template error:", error)
      }
    }
  }

  if (isLoading) {
    return <StatsSkeleton items={6} />
  }

  if (error) {
    return <EmailTemplatesError onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Modèles d&apos;Email</h3>
          <p className="text-sm text-muted-foreground">{templates?.length ?? 0} modèle(s) disponible(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Modèle
          </Button>
        </div>
      </div>

      {!templates || templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun modèle d&apos;email</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre premier modèle d&apos;email pour gagner du temps lors de l&apos;envoi de messages récurrents.
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un Modèle
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template: EmailTemplate) => (
            <EmailTemplateCard
              key={template.id}
              template={template}
              onEdit={() => setEditingTemplate(template)}
              onDelete={() => setDeletingTemplate(template)}
            />
          ))}
        </div>
      )}

      <EmailTemplateForm open={showCreateForm} onOpenChange={setShowCreateForm} mode="create" />

      {editingTemplate && (
        <EmailTemplateForm
          open={!!editingTemplate}
          onOpenChange={(open) => !open && setEditingTemplate(null)}
          template={editingTemplate}
          mode="edit"
        />
      )}

      <AlertDialog open={!!deletingTemplate} onOpenChange={(open) => !open && setDeletingTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le modèle</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le modèle {deletingTemplate?.name} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTemplate.isPending}
            >
              {deleteTemplate.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function EmailTemplatesError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <XCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
      <p className="text-muted-foreground mb-4">Impossible de charger les modèles d&apos;email. Veuillez réessayer.</p>
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
    </div>
  )
}

function EmailTemplateCard({ template, onEdit, onDelete }: { template: EmailTemplate, onEdit: () => void, onDelete: () => void }) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {template.name}
            </CardTitle>
            <CardDescription className="line-clamp-1">{template.recipient}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{template.body}</p>
          {template.variables && template.variables.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Variables:</p>
              <div className="flex flex-wrap gap-1">
                {template.variables.slice(0, 3).map((variable: string) => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
                {template.variables.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.variables.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Créé {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true, locale: fr })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
