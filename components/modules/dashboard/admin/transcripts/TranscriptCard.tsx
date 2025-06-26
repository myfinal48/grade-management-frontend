"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, GraduationCap, Calendar, Award, FileText, Eye } from "lucide-react"
import type { Transcript } from "@/types/transcript"
import { TranscriptGradesTable } from "@/components/modules/dashboard/admin/transcripts/TranscriptGradesTable"
import { useState } from "react"

interface TranscriptCardProps {
  transcript: Transcript
}

export function TranscriptCard({ transcript }: Readonly<TranscriptCardProps>) {
  const [showGrades, setShowGrades] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case "pass":
      case "passed":
      case "admis":
      case "réussi":
        return "bg-green-100 text-green-800 border-green-200"
      case "fail":
      case "failed":
      case "échec":
      case "échoué":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getMentionColor = (mention: string) => {
    switch (mention.toLowerCase()) {
      case "excellent":
      case "excellente":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "very good":
      case "très bien":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "good":
      case "bien":
        return "bg-green-100 text-green-800 border-green-200"
      case "satisfactory":
      case "satisfaisant":
      case "passable":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {transcript.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {transcript.registerNumber}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {transcript.universityYear}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowGrades(!showGrades)}>
              <Eye className="mr-2 h-4 w-4" />
              {showGrades ? "Masquer" : "Voir"} les Notes
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informations Académiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Filière</p>
            <p className="text-sm font-semibold">{transcript.major}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Niveau</p>
            <p className="text-sm font-semibold">{transcript.level}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Semestre</p>
            <p className="text-sm font-semibold">{transcript.semester}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Référence</p>
            <p className="text-sm font-semibold">{transcript.reference}</p>
          </div>
        </div>

        <Separator />

        {/* Performance Académique */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Award className="h-4 w-4" />
            Performance Académique
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Crédits Inscrits</p>
              <p className="text-lg font-bold text-blue-600">{transcript.creditsRegistered}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Crédits Validés</p>
              <p className="text-lg font-bold text-green-600">{transcript.creditsValid}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Crédits Validés</p>
              <p className="text-lg font-bold text-green-600">{transcript.totalCreditsValid}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Moyenne Générale</p>
              <p className="text-lg font-bold text-purple-600">{transcript.averageGenerale.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Moyenne Cumulative</p>
              <p className="text-lg font-bold text-purple-600">{transcript.cumulativeAverage.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date de Signature</p>
              <p className="text-sm font-semibold">{formatDate(transcript.signatureDate)}</p>
            </div>
          </div>

          {/* Badges de Statut */}
          <div className="flex gap-2">
            <Badge className={getMentionColor(transcript.generalMention)}>{transcript.generalMention}</Badge>
            <Badge className={getResultColor(transcript.result)}>{transcript.result}</Badge>
          </div>
        </div>

        {/* Tableau des Notes */}
        {showGrades && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Notes des Cours ({transcript.grades.length} cours)
              </h4>
              <TranscriptGradesTable grades={transcript.grades} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
