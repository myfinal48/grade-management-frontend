"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Clock, CheckCircle, XCircle, Paperclip, RefreshCw, Trash2, Search, ArrowUpDown } from "lucide-react"
import { useEmailHistory, useDeleteEmailHistory, useUpdateEmailHistory } from "@/hooks/useEmails"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { EmailHistoryItem } from "@/types/email"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog"
import { EmptyState } from "@/components/global/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"

export function EmailHistory() {
  const { data: emails, isLoading, error, refetch } = useEmailHistory()
  const deleteEmail = useDeleteEmailHistory()
  const updateEmail = useUpdateEmailHistory()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editBody, setEditBody] = useState("")
  const [editFile, setEditFile] = useState<File | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "recipient" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedEmails = useMemo(() => {
    if (!emails) return []
    
    const filtered = emails.filter((email: EmailHistoryItem) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        (email.recipient?.toLowerCase().includes(searchLower) ||
        email.body?.toLowerCase().includes(searchLower) ||
        email.status?.toLowerCase().includes(searchLower))
      )
    })
    
    filtered.sort((a: EmailHistoryItem, b: EmailHistoryItem) => {
      let comparison = 0
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          break
        case "recipient":
          comparison = (a.recipient || "").localeCompare(b.recipient || "")
          break
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "")
          break
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })
    
    return filtered
  }, [emails, searchTerm, sortBy, sortOrder])

  if (isLoading) {
    return <EmailHistoryLoading />
  }

  if (error) {
    return <EmailHistoryError onRetry={() => refetch()} />
  }

  if (!emails || emails.length === 0) {
    return (
      <EmptyState
        title="Aucun email envoyé"
        message="L'historique des emails envoyés apparaîtra ici une fois que vous aurez commencé à envoyer des messages."
        icon={Mail}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Historique des Emails</h3>
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedEmails.length} email(s) affiché(s) sur {emails.length}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par destinataire, contenu ou statut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: "date" | "recipient" | "status") => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Trier par date</SelectItem>
              <SelectItem value="recipient">Trier par destinataire</SelectItem>
              <SelectItem value="status">Trier par statut</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={`Ordre ${sortOrder === "asc" ? "croissant" : "décroissant"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredAndSortedEmails.length === 0 ? (
        <EmptyState
          title="Aucun résultat"
          message="Aucun email ne correspond à votre recherche."
          icon={Search}
        />
      ) : (
        <div className="grid gap-4">

        {filteredAndSortedEmails.map((email: EmailHistoryItem) => (
          <Card key={email.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {email.recipient}
                    {email.hasAttachment && <Paperclip className="h-4 w-4 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>À: {email.recipient}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      email.status === "sent" ? "default" : email.status === "failed" ? "destructive" : "secondary"
                    }
                  >
                    {email.status === "sent" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {email.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                    {email.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                    {email.status === "sent" ? "Envoyé" : email.status === "failed" ? "Échec" : "En attente"}
                  </Badge>
                  <Button size="icon" variant="ghost" onClick={() => setShowDeleteConfirm(email.id)} title="Supprimer" disabled={deleteEmail.isPending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  {editingId === email.id ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault()
                        const updateData: Partial<EmailHistoryItem & { file?: File }> = { body: editBody }
                        if (editFile) updateData.file = editFile
                        updateEmail.mutate({ id: email.id, data: updateData }, {
                          onSuccess: () => {
                            toast.success("Email mis à jour avec succès")
                          }
                        })
                        setEditingId(null)
                        setEditFile(null)
                      }}
                      className="flex flex-col gap-2"
                    >
                      <textarea
                        className="border rounded p-2 text-sm"
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <Button type="submit" size="sm">Enregistrer</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => { setEditingId(null); setEditFile(null); }}>Annuler</Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          title="Joindre un fichier"
                          onClick={() => document.getElementById(`file-upload-${email.id}`)?.click()}
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <input
                          id={`file-upload-${email.id}`}
                          type="file"
                          accept="application/pdf"
                          style={{ display: "none" }}
                          onChange={e => {
                            const file = e.target.files?.[0] || null
                            if (file && file.type !== "application/pdf") {
                              toast.error("Seuls les fichiers PDF sont acceptés.")
                              setEditFile(null)
                              return
                            }
                            setEditFile(file)
                          }}
                        />
                        {editFile && (
                          <div className="text-xs text-muted-foreground">{editFile.name}</div>
                        )}
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-muted-foreground line-clamp-3">{email.body}</p>
                  )}
                </div>

                {email.hasAttachment && email.attachmentName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                    <span>Pièce jointe: {email.attachmentName}</span>
                  </div>
                )}

                {email.status === "failed" && email.errorMessage && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{email.errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(email.sentAt), { addSuffix: true, locale: fr })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      <ConfirmDialog open={!!showDeleteConfirm} onOpenChange={open => !open && setShowDeleteConfirm(null)}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Voulez-vous vraiment supprimer cet email ?</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Annuler</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDeleteConfirm) deleteEmail.mutate(showDeleteConfirm)
                setShowDeleteConfirm(null)
              }}
              disabled={deleteEmail.isPending}
            >
              Supprimer
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  )
}

function EmailHistoryLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-1" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function EmailHistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <XCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
      <p className="text-muted-foreground mb-4">Impossible de charger l&apos;historique des emails. Veuillez réessayer.</p>
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
    </div>
  )
}
