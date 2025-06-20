"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useGeneratePdfTranscript, useStudents } from "@/hooks/usePdfTranscript"
import { useSemesters } from "@/hooks/useSemesters"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const pdfTranscriptSchema = z.object({
  studentIds: z.array(z.number()).min(1, "At least one student must be selected"),
  semesterIds: z.array(z.number()).min(1, "At least one semester must be selected"),
  universityYear: z.string().min(1, "University year is required"),
})

type PdfTranscriptFormData = z.infer<typeof pdfTranscriptSchema>

interface PdfTranscriptFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function PdfTranscriptForm({ open, onOpenChange }: PdfTranscriptFormProps) {
  const generatePdf = useGeneratePdfTranscript()
  const { data: semesters, isLoading: semestersLoading } = useSemesters()
  const { data: students, isLoading: studentsLoading } = useStudents()
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([])

  const form = useForm<PdfTranscriptFormData>({
    resolver: zodResolver(pdfTranscriptSchema),
    defaultValues: {
      studentIds: [],
      semesterIds: [],
      universityYear: new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
    },
  })

  const handleStudentChange = (studentId: number, checked: boolean) => {
    const updated = checked
      ? [...selectedStudents, studentId]
      : selectedStudents.filter((id) => id !== studentId)
    setSelectedStudents(updated)
    form.setValue("studentIds", updated)
  }

  const handleSemesterChange = (semesterId: number, checked: boolean) => {
    const updated = checked
      ? [...selectedSemesters, semesterId]
      : selectedSemesters.filter((id) => id !== semesterId)
    setSelectedSemesters(updated)
    form.setValue("semesterIds", updated)
  }

  const onSubmit = async (data: PdfTranscriptFormData) => {
    try {
      await generatePdf.mutateAsync({
        studentIds: selectedStudents,
        semesterIds: selectedSemesters,
        universityYear: data.universityYear,
      })
      onOpenChange(false)
      form.reset()
      setSelectedStudents([])
      setSelectedSemesters([])
    } catch (error) {
      console.error("Error generating PDF:", error)
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  const isLoading = generatePdf.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Générer des relevés PDF</DialogTitle>
          <DialogDescription>
            Sélectionnez les étudiants et les semestres pour générer les relevés PDF pour l&apos;année universitaire spécifiée.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="universityYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année universitaire</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 2024/2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentIds"
              render={() => (
                <FormItem>
                  <FormLabel>Étudiants</FormLabel>
                  {studentsLoading ? (
                    <div className="flex items-center justify-center h-32 border rounded-md">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Chargement des étudiants...</span>
                    </div>
                  ) : (
                    <ScrollArea className="h-32 w-full border rounded-md p-4">
                      <div className="space-y-2">
                        {students?.map((student) => (
                          <div key={student.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`student-${student.id}`}
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={(checked) => handleStudentChange(student.id, checked as boolean)}
                            />
                            <label
                              htmlFor={`student-${student.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {student.firstName} {student.lastName} ({student.studentNumber})
                            </label>
                          </div>
                        ))}
                        {students?.length === 0 && (
                          <p className="text-sm text-muted-foreground">Aucun étudiant disponible</p>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semesterIds"
              render={() => (
                <FormItem>
                  <FormLabel>Semestres</FormLabel>
                  {semestersLoading ? (
                    <div className="flex items-center justify-center h-32 border rounded-md">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Chargement des semestres...</span>
                    </div>
                  ) : (
                    <ScrollArea className="h-32 w-full border rounded-md p-4">
                      <div className="space-y-2">
                        {semesters?.map((semester) => (
                          <div key={semester.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`semester-${semester.id}`}
                              checked={selectedSemesters.includes(semester.id)}
                              onCheckedChange={(checked) => handleSemesterChange(semester.id, checked as boolean)}
                            />
                            <label
                              htmlFor={`semester-${semester.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {semester.name} ({semester.universityYear})
                            </label>
                          </div>
                        ))}
                        {semesters?.length === 0 && (
                          <p className="text-sm text-muted-foreground">Aucun semestre disponible</p>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading || studentsLoading || semestersLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer le PDF"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

