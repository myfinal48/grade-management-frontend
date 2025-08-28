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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, FileSpreadsheet, Download, Building, Users, Calendar } from "lucide-react"
import type { TranscriptFilters } from "@/types/transcript"
import type { University } from "@/types/university"
import { useExportMultipleTranscriptsPDF, useExportMultipleTranscriptsExcel } from "@/hooks/useTranscripts"

interface ExportFormatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: TranscriptFilters
  selectedUniversity?: University
  totalCount: number
}

export function ExportFormatModal({
  open,
  onOpenChange,
  filters,
  selectedUniversity,
  totalCount,
}: ExportFormatModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel" | null>(null)

  const exportPDF = useExportMultipleTranscriptsPDF()
  const exportExcel = useExportMultipleTranscriptsExcel()

  const handleExport = async () => {
    if (!selectedFormat) return
    if (selectedFormat === "pdf") {
      await exportPDF.mutateAsync({
        filters,
        universityId: selectedUniversity?.id,
      })
    } else if (selectedFormat === "excel") {
      await exportExcel.mutateAsync(filters)
    }
    onOpenChange(false)
    setSelectedFormat(null)
  }

  const isLoading = exportPDF.isPending || exportExcel.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Choisir le Format d&apos;Export
          </DialogTitle>
          <DialogDescription>
            Sélectionnez le format dans lequel vous souhaitez exporter les {totalCount} relevé
            {totalCount > 1 ? "s" : ""} de notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Informations sur l&apos;Export</h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{filters.studentIds.length} étudiant(s) sélectionné(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{filters.semesterIds.length} semestre(s) sélectionné(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Année universitaire: {filters.universityYear}</span>
              </div>
              {selectedUniversity && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Université: {selectedUniversity.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all ${
                selectedFormat === "pdf"
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedFormat("pdf")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-red-600" />
                  Export PDF
                  {selectedFormat === "pdf" && <Badge variant="default">Sélectionné</Badge>}
                </CardTitle>
                <CardDescription>Fichiers PDF individuels dans un ZIP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Format officiel pour impression</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Inclut le logo et les informations de l&apos;université</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Mise en page professionnelle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Fichier ZIP contenant tous les PDF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                selectedFormat === "excel"
                  ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedFormat("excel")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  Export Excel
                  {selectedFormat === "excel" && <Badge variant="default">Sélectionné</Badge>}
                </CardTitle>
                <CardDescription>Fichier Excel avec toutes les données</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Idéal pour l&apos;analyse de données</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Facilite les calculs et statistiques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Format compatible avec Excel/LibreOffice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Fichier unique .xlsx</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedFormat === "excel" && !selectedUniversity && (
            <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <Building className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">Aucune université sélectionnée</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    L&apos;export Excel ne nécessite pas d&apos;informations d&apos;université, mais vous pouvez en sélectionner une
                    pour les exports PDF futurs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={!selectedFormat || isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exportation...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exporter en {selectedFormat?.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
