"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Transcript } from "@/types/transcript"
import { GraduationCap } from "lucide-react"

interface TranscriptDetailsProps {
  transcript: Transcript
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TranscriptDetails({ transcript, open, onOpenChange }: Readonly<TranscriptDetailsProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" w-full max-w-6xl h-[90vh] pr-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Relevé de Notes - {transcript.name}
          </DialogTitle>
          <DialogDescription>
            Détails complets du relevé de notes pour {transcript.registerNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Student Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Informations Étudiant</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p className="font-medium text-foreground">{transcript.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Numéro d&apos;inscription</p>
                <p className="font-mono text-foreground">{transcript.registerNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Filière</p>
                <Badge variant="outline" className="text-sm">{transcript.major}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Niveau</p>
                <Badge variant="secondary" className="text-sm">{transcript.level}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Semestre</p>
                <Badge className="text-sm">{transcript.semester}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Année Universitaire</p>
                <p className="font-mono text-lg font-semibold text-primary">{transcript.universityYear}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />

          {/* Academic Results */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Résultats Académiques</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground">Moyenne Générale</p>
                <p className="text-2xl font-bold text-foreground">{transcript.averageGenerale.toFixed(2)}/20</p>
                <Badge 
                  variant={transcript.averageGenerale >= 10 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {transcript.generalMention}
                </Badge>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground">Résultat</p>
                <Badge 
                  variant={transcript.result === "ADMIS" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {transcript.result}
                </Badge>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
                <p className="text-xl font-bold text-foreground">{transcript.cumulativeAverage.toFixed(2)}/20</p>
                <p className="text-sm font-medium text-muted-foreground">Moyenne Cumulative</p>
              </div>
              <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
                <p className="text-xl font-bold text-primary">{transcript.totalCreditsValid}</p>
                <p className="text-sm font-medium text-muted-foreground">Crédits Totaux</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />

          {/* Credits Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Crédits</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground">Crédits Inscrits</p>
                <p className="text-2xl font-bold text-foreground">{transcript.creditsRegistered}</p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground">Crédits Validés</p>
                <p className="text-2xl font-bold text-primary">{transcript.creditsValid}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />

          {/* Grades Table */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Notes par Matière</h3>
            </div>
            <div className="">
              <div className="rounded-lg border border-border">
                <table className="w-full table-fixed">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground w-20">Code</th>
                      <th className="text-left p-3 font-semibold text-foreground">Matière</th>
                      <th className="text-center p-3 font-semibold text-foreground w-24">Note</th>
                      <th className="text-center p-3 font-semibold text-foreground w-20">Crédit</th>
                      <th className="text-center p-3 font-semibold text-foreground w-28">Mention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcript.grades.map((grade) => (
                      <tr key={`${grade.code}-${grade.majorName}`} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono text-xs font-medium">{grade.code}</td>
                        <td className="p-3 font-medium text-xs">{grade.majorName}</td>
                        <td className="p-3 text-center">
                          <Badge 
                            variant={grade.value >= 10 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {grade.value.toFixed(2)}/20
                          </Badge>
                        </td>
                        <td className="p-3 text-center font-medium">{grade.credit}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs">{grade.mention}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />

          {/* Document Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Informations Document</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date de signature</p>
                <p className="font-medium text-foreground text-sm">{transcript.signatureDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Référence</p>
                <p className="font-mono text-foreground text-sm">{transcript.reference}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
