"use client"

import { useState } from "react"
import { useUniversities } from "@/hooks/useUniversities"
import { useUsers } from "@/hooks/useUsers"
import { useSemesters } from "@/hooks/useSemesters"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { MultiSelect } from "@/components/ui/multi-select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { TranscriptFilters as TTranscriptFilters } from "@/types/transcript"
import { useTranscripts } from "@/hooks/useTranscripts"
import { UserRoles } from "@/types"
import { Filter, AlertTriangle, Download } from "lucide-react"
import { ExportFormatModal } from "./ExportFormatModal"

export function Transcripts() {
  const [filters, setFilters] = useState<TTranscriptFilters>({
    studentIds: [],
    semesterIds: [],
    universityYear: "",
  })

  const [selectedUniversityId, setSelectedUniversityId] = useState<number | undefined>(undefined)
  const [hasSearched, setHasSearched] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const { data: transcripts, isLoading } = useTranscripts(filters, hasSearched)
  const { data: universities } = useUniversities()
  const { getUsers } = useUsers({ role: UserRoles.STUDENT })
  const { data: semesters } = useSemesters()

  const users = getUsers.data

  const studentOptions = (users || []).map(user => ({
    value: user.id.toString(),
    label: `${user.firstName} ${user.lastName}`,
    searchText: `${user.firstName} ${user.lastName} ${user.registrationNumber} ${user.email}`,
  }))

  const semesterOptions = (semesters || []).map(semester => ({
    value: semester.id.toString(),
    label: `${semester.name} - ${semester.levelName || 'N/A'}`,
    searchText: `${semester.name} ${semester.levelName || ''}`,
  }))

  const universityOptions = (universities || []).map(university => ({
    value: university.id.toString(),
    label: university.name,
    searchText: university.name,
  }))

  const universityYearOptions = Array.from(
    new Set((semesters || []).map(semester => semester.universityYear))
  ).map(year => ({
    value: year,
    label: year,
  }))

  const handleStudentChange = (values: string[]) => {
    setFilters(prev => ({
      ...prev,
      studentIds: values.map(v => parseInt(v))
    }))
  }

  const handleSemesterChange = (values: string[]) => {
    setFilters(prev => ({
      ...prev,
      semesterIds: values.map(v => parseInt(v))
    }))
  }

  const handleUniversityChange = (values: string[]) => {
    if (values.length > 0) {
      setSelectedUniversityId(parseInt(values[0]))
    } else {
      setSelectedUniversityId(undefined)
    }
  }

  const handleUniversityYearChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      universityYear: value
    }))
  }

  const handleSearch = () => {
    setHasSearched(true)
  }

  const handleClearFilters = () => {
    setFilters({
      studentIds: [],
      semesterIds: [],
      universityYear: "",
    })
    setSelectedUniversityId(undefined)
    setHasSearched(false)
  }

  const hasFilters = filters.studentIds.length > 0 || filters.semesterIds.length > 0 || filters.universityYear.length > 0 || selectedUniversityId
  const canSearch = filters.studentIds.length > 0 || filters.semesterIds.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Relevés de Notes</h2>
          <p className="text-muted-foreground">
            Gérer et consulter les relevés de notes des étudiants
          </p>
        </div>
        <Badge variant={hasFilters ? "default" : "secondary"}>
          {hasSearched ? (transcripts?.length || 0) : 0} relevé(s)
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de Recherche
            <Badge variant={hasFilters ? "default" : "secondary"}>
              {filters.studentIds.length + filters.semesterIds.length + (selectedUniversityId ? 1 : 0) + (filters.universityYear ? 1 : 0)} filtres
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canSearch && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Filtres requis</p>
                  <p className="text-sm text-amber-700">
                    Vous devez sélectionner au moins un étudiant ou un semestre pour effectuer une recherche.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Universités ({selectedUniversityId ? 1 : 0})
              </label>
              <MultiSelect
                options={universityOptions}
                value={selectedUniversityId ? [selectedUniversityId.toString()] : []}
                onValueChange={handleUniversityChange}
                placeholder="Sélectionner une université..."
                searchPlaceholder="Rechercher une université..."
                emptyText="Aucune université trouvée."
                maxCount={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Étudiants ({filters.studentIds.length})
              </label>
              <MultiSelect
                options={studentOptions}
                value={filters.studentIds.map(id => id.toString())}
                onValueChange={handleStudentChange}
                placeholder="Sélectionner des étudiants..."
                searchPlaceholder="Rechercher un étudiant..."
                emptyText="Aucun étudiant trouvé."
                maxCount={2}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Semestres ({filters.semesterIds.length})
              </label>
              <MultiSelect
                options={semesterOptions}
                value={filters.semesterIds.map(id => id.toString())}
                onValueChange={handleSemesterChange}
                placeholder="Sélectionner des semestres..."
                searchPlaceholder="Rechercher un semestre..."
                emptyText="Aucun semestre trouvé."
                maxCount={2}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Année Universitaire</label>
              <Select value={filters.universityYear} onValueChange={handleUniversityYearChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une année..." />
                </SelectTrigger>
                <SelectContent>
                  {universityYearOptions.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={handleSearch} 
              disabled={!canSearch}
              className="flex-1 md:flex-none"
            >
              Rechercher les Relevés
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              disabled={!hasFilters}
            >
              Effacer les Filtres
            </Button>
            {hasSearched && transcripts && transcripts.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <DataTable 
        columns={columns} 
        data={transcripts || []} 
        isLoading={isLoading && hasSearched}
        hasSearched={hasSearched}
      />

      <ExportFormatModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        filters={filters}
        selectedUniversity={universities?.find(u => u.id === selectedUniversityId)}
        totalCount={transcripts?.length || 0}
      />
    </div>
  )
}
