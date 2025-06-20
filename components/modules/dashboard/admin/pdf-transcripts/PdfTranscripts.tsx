"use client"

import { useState, useMemo, useEffect } from "react"
import { usePdfTranscriptRequests, useStudents } from "@/hooks/usePdfTranscript"
import { useSemesters } from "@/hooks/useSemesters"
import { PdfTranscriptHeader } from "./PdfTranscriptHeader"
import { PdfTranscriptGrid } from "./PdfTranscriptGrid"
import { PdfTranscriptLoading } from "./PdfTranscriptLoading"
import { PdfTranscriptError } from "./PdfTranscriptError"
import { PdfTranscriptForm } from "./PdfTranscriptForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function PdfTranscripts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const { data: requests, isLoading, error, refetch } = usePdfTranscriptRequests()
  const { data: students } = useStudents()
  const { data: semesters } = useSemesters()

  // Mark as initialized after first load attempt
  useEffect(() => {
    if (!isLoading) {
      setHasInitialized(true)
    }
  }, [isLoading])

  // Enhance requests with student and semester names
  const enhancedRequests = useMemo(() => {
    if (!requests || !students || !semesters) return requests || []

    return requests.map((request) => ({
      ...request,
      studentNames: request.studentIds.map((id) => {
        const student = students.find((s) => s.id === id)
        return student ? `${student.firstName} ${student.lastName}` : `Student ${id}`
      }),
      semesterNames: request.semesterIds.map((id) => {
        const semester = semesters.find((s) => s.id === id)
        return semester ? semester.name : `Semester ${id}`
      }),
    }))
  }, [requests, students, semesters])

  const filteredRequests = useMemo(() => {
    if (!enhancedRequests) return []

    if (!searchQuery.trim()) return enhancedRequests

    const query = searchQuery.toLowerCase()
    return enhancedRequests.filter(
      (request) =>
        request.universityYear.toLowerCase().includes(query) ||
        request.status.toLowerCase().includes(query) ||
        request.studentNames?.some((name) => name.toLowerCase().includes(query)) ||
        request.semesterNames?.some((name) => name.toLowerCase().includes(query)),
    )
  }, [enhancedRequests, searchQuery])

  // Show loading only on initial load
  if (isLoading && !hasInitialized) {
    return <PdfTranscriptLoading />
  }

  // Show error only for unexpected errors (not 403/404 for optional endpoints)
  if (error && hasInitialized) {
    const isOptionalEndpointError =
      error.name === "OptionalEndpointForbiddenError" ||
      error.message.includes("Access forbidden to optional endpoint") ||
      (error.name === "NotFoundError" && error.message.includes("Resource not found"))

    if (!isOptionalEndpointError) {
      return <PdfTranscriptError error={error} onRetry={() => refetch()} />
    }
  }

  return (
    <div className="space-y-6 relative">
      <PdfTranscriptHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={enhancedRequests?.length || 0}
      />

      <PdfTranscriptGrid requests={filteredRequests} />

      {/* Floating Generate Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowGenerateDialog(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Generate PDF</span>
        </Button>
      </div>

      <PdfTranscriptForm open={showGenerateDialog} onOpenChange={setShowGenerateDialog} />
    </div>
  )
}
