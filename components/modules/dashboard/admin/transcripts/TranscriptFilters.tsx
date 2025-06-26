"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { X, Search, Filter, AlertTriangle, Plus } from "lucide-react"
import type { TranscriptFilters } from "@/types/transcript"

const transcriptFiltersSchema = z.object({
  studentIdInput: z.string().optional(),
  semesterIdInput: z.string().optional(),
  universityYear: z.string().optional(),
})

type TranscriptFiltersFormData = z.infer<typeof transcriptFiltersSchema>

interface TranscriptFiltersProps {
  filters: TranscriptFilters
  onFiltersChange: (filters: TranscriptFilters) => void
  onSearch: () => void
  isLoading?: boolean
}

export function TranscriptFilterComponent({ filters, onFiltersChange, onSearch, isLoading }: Readonly<TranscriptFiltersProps>) {
  const form = useForm<TranscriptFiltersFormData>({
    resolver: zodResolver(transcriptFiltersSchema),
    defaultValues: {
      studentIdInput: "",
      semesterIdInput: "",
      universityYear: filters.universityYear || "",
    },
  })

  const addStudentId = () => {
    const studentIdInput = form.getValues("studentIdInput")
    const id = Number.parseInt(studentIdInput?.trim() ?? "")
    if (id && !filters.studentIds.includes(id)) {
      onFiltersChange({
        ...filters,
        studentIds: [...filters.studentIds, id],
      })
      form.setValue("studentIdInput", "")
    }
  }

  const removeStudentId = (id: number) => {
    onFiltersChange({
      ...filters,
      studentIds: filters.studentIds.filter((studentId) => studentId !== id),
    })
  }

  const addSemesterId = () => {
    const semesterIdInput = form.getValues("semesterIdInput")
    const id = Number.parseInt(semesterIdInput?.trim() ?? "")
    if (id && !filters.semesterIds.includes(id)) {
      onFiltersChange({
        ...filters,
        semesterIds: [...filters.semesterIds, id],
      })
      form.setValue("semesterIdInput", "")
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
      studentIdInput: "",
      semesterIdInput: "",
      universityYear: "",
    })
  }

  const addExampleData = () => {
    onFiltersChange({
      studentIds: [48230000, 48230001, 48230002],
      semesterIds: [1, 2],
      universityYear: "2024/2025",
    })
    form.setValue("universityYear", "2024/2025")
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
        {/* Avertissement si pas de filtres */}
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
            {/* IDs Étudiants */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="studentIdInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IDs Étudiants ({filters.studentIds.length})</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 48230000"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addStudentId()
                            }
                          }}
                          min={0}
                        />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={addStudentId}>
                        Ajouter
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {filters.studentIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.studentIds.map((id) => (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      Étudiant {id}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeStudentId(id)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* IDs Semestres */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="semesterIdInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IDs Semestres ({filters.semesterIds.length})</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 1"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSemesterId()
                            }
                          }}
                          min={0}
                        />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={addSemesterId}>
                        Ajouter
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {filters.semesterIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.semesterIds.map((id) => (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      Semestre {id}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeSemesterId(id)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Année Universitaire */}
            <FormField
              control={form.control}
              name="universityYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année Universitaire</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: 2024-2025"
                      {...field}
                      value={filters.universityYear}
                      onChange={(e) => {
                        field.onChange(e)
                        handleUniversityYearChange(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bouton de Recherche */}
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
