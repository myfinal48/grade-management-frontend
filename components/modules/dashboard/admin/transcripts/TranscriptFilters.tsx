"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Form } from "@/components/ui/form"
import { X, Search, Filter, AlertTriangle, Plus } from "lucide-react"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { useUsers } from "@/hooks/useUsers"
import { useSemesters } from "@/hooks/useSemesters"
import { UserRoles } from "@/types"
import type { TranscriptFilters } from "@/types/transcript"

const transcriptFiltersSchema = z.object({
  universityYear: z.string().optional(),
})

type TranscriptFiltersFormData = z.infer<typeof transcriptFiltersSchema>

const universityYears = [
  { value: "2023/2024", label: "2023/2024" },
  { value: "2024/2025", label: "2024/2025" },
  { value: "2025/2026", label: "2025/2026" },
]

interface TranscriptFiltersProps {
  filters: TranscriptFilters
  onFiltersChange: (filters: TranscriptFilters) => void
  onSearch: () => void
  isLoading?: boolean
}

export function TranscriptFilterComponent({ filters, onFiltersChange, onSearch, isLoading }: Readonly<TranscriptFiltersProps>) {
  const { getUsers } = useUsers({ role: UserRoles.STUDENT })
  const { data: semesters } = useSemesters()
  const users = getUsers.data
  
  const form = useForm<TranscriptFiltersFormData>({
    resolver: zodResolver(transcriptFiltersSchema),
    defaultValues: {
      universityYear: filters.universityYear || "",
    },
  })

  const studentOptions = (users || []).map(user => ({
    value: user.id.toString(),
    label: `${user.firstName} ${user.lastName} (${user.registrationNumber})`,
    searchText: `${user.firstName} ${user.lastName} ${user.registrationNumber} ${user.email}`,
  }))

  const semesterOptions = (semesters || []).map(semester => ({
    value: semester.id.toString(),
    label: `${semester.name} - ${semester.levelName || 'N/A'}`,
    searchText: `${semester.name} ${semester.levelName || ''}`,
  }))

  const addStudentId = (studentId: string) => {
    const id = Number.parseInt(studentId)
    if (id && !filters.studentIds.includes(id)) {
      onFiltersChange({
        ...filters,
        studentIds: [...filters.studentIds, id],
      })
    }
  }

  const removeStudentId = (id: number) => {
    onFiltersChange({
      ...filters,
      studentIds: filters.studentIds.filter((studentId) => studentId !== id),
    })
  }

  const addSemesterId = (semesterId: string) => {
    const id = Number.parseInt(semesterId)
    if (id && !filters.semesterIds.includes(id)) {
      onFiltersChange({
        ...filters,
        semesterIds: [...filters.semesterIds, id],
      })
    }
  }

  const removeSemesterId = (id: number) => {
    onFiltersChange({
      ...filters,
      semesterIds: filters.semesterIds.filter((semesterId) => semesterId !== id),
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      studentIds: [],
      semesterIds: [],
      universityYear: "",
    })
    form.reset({
      universityYear: "",
    })
  }

  const addExampleData = () => {
    onFiltersChange({
      studentIds: [48230000, 48230001, 48230002],
      semesterIds: [1, 2],
      universityYear: "2024/2025",
    })
  }

  const handleUniversityYearChange = (value: string) => {
    onFiltersChange({
      ...filters,
      universityYear: value,
    })
  }

  const hasFilters =
    filters.studentIds.length > 0 || filters.semesterIds.length > 0 || filters.universityYear.length > 0

  const canSearch = filters.studentIds.length > 0 || filters.semesterIds.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres des Relevés
              <Badge variant={hasFilters ? "default" : "secondary"}>
                {filters.studentIds.length + filters.semesterIds.length} filtres
              </Badge>
            </CardTitle>
            <CardDescription>Filtrer les relevés par ID étudiant, ID semestre et année universitaire</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addExampleData}>
              <Plus className="mr-2 h-4 w-4" />
              Exemple
            </Button>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Effacer Tout
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!canSearch && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Filtres requis</p>
                <p className="text-sm text-amber-700">
                  Vous devez ajouter au moins un ID étudiant ou un ID semestre pour effectuer une recherche.
                </p>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <div className="space-y-6">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Étudiants ({filters.studentIds.length})</label>
                <SearchableSelect
                  options={studentOptions}
                  onValueChange={addStudentId}
                  placeholder="Sélectionner un étudiant..."
                  searchPlaceholder="Rechercher un étudiant..."
                  emptyText="Aucun étudiant trouvé."
                  className="w-full mt-1"
                />
              </div>
              {filters.studentIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.studentIds.map((id) => {
                    const student = users?.find(u => u.id === id)
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {student ? `${student.firstName} ${student.lastName}` : `Étudiant ${id}`}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeStudentId(id)}
                        />
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Semestres ({filters.semesterIds.length})</label>
                <SearchableSelect
                  options={semesterOptions}
                  onValueChange={addSemesterId}
                  placeholder="Sélectionner un semestre..."
                  searchPlaceholder="Rechercher un semestre..."
                  emptyText="Aucun semestre trouvé."
                  className="w-full mt-1"
                />
              </div>
              {filters.semesterIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.semesterIds.map((id) => {
                    const semester = semesters?.find(s => s.id === id)
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {semester ? semester.name : `Semestre ${id}`}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeSemesterId(id)}
                        />
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Année Universitaire</label>
              <SearchableSelect
                options={universityYears}
                value={filters.universityYear}
                onValueChange={handleUniversityYearChange}
                placeholder="Sélectionner une année..."
                searchPlaceholder="Rechercher une année..."
                emptyText="Aucune année trouvée."
                className="w-full mt-1"
              />
            </div>

            <Button onClick={onSearch} disabled={!canSearch || isLoading} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Recherche..." : "Rechercher les Relevés"}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
