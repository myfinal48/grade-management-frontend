"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, AlertCircle } from "lucide-react"
import type { University } from "@/types/university"

interface UniversitySelectorProps {
  universities: University[]
  selectedUniversityId?: number
  onUniversityChange: (universityId: number | undefined) => void
}

export function UniversitySelector({
  universities,
  selectedUniversityId,
  onUniversityChange,
}: UniversitySelectorProps) {
  const selectedUniversity = universities.find((u) => u.id === selectedUniversityId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Université pour l&apos;En-tête PDF
            </CardTitle>
            <CardDescription>
              Sélectionnez l&apos;université dont les informations apparaîtront dans l&apos;en-tête des PDF exportés
            </CardDescription>
          </div>
          {selectedUniversity && (
            <Badge variant="default" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {selectedUniversity.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select
            value={selectedUniversityId?.toString() ?? "none"}
            onValueChange={(value) => onUniversityChange(value === "none" ? undefined : Number.parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une université..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune université sélectionnée</SelectItem>
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{university.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUniversity && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-blue-900">{selectedUniversity.name}</p>
                <p className="text-sm text-blue-700">{selectedUniversity.address}</p>
                <div className="flex gap-4 text-xs text-blue-600">
                  <span>📞 {selectedUniversity.phone}</span>
                  <span>🌐 {selectedUniversity.website}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedUniversityId && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Aucune université sélectionnée</p>
                <p className="text-sm text-amber-700">
                  Les PDF exportés n&apos;auront pas d&apos;informations d&apos;université dans l&apos;en-tête. Sélectionnez une université
                  pour personnaliser l&apos;en-tête.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
