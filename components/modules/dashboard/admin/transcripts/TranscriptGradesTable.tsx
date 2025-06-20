"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Grade } from "@/types/transcript"

interface TranscriptGradesTableProps {
  grades: Grade[]
}

export function TranscriptGradesTable({ grades }: TranscriptGradesTableProps) {
  const getMentionColor = (mention: string) => {
    switch (mention.toLowerCase()) {
      case "excellent":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "very good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "good":
        return "bg-green-100 text-green-800 border-green-200"
      case "satisfactory":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "fail":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getGradeColor = (value: number) => {
    if (value >= 16) return "text-purple-600 font-bold"
    if (value >= 14) return "text-blue-600 font-bold"
    if (value >= 12) return "text-green-600 font-bold"
    if (value >= 10) return "text-yellow-600 font-bold"
    return "text-red-600 font-bold"
  }

  if (grades.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No grades available for this transcript.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Code</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead className="text-center">Grade</TableHead>
            <TableHead className="text-center">Credits</TableHead>
            <TableHead className="text-center">Mention</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade, index) => (
            <TableRow key={`${grade.code}-${index}`}>
              <TableCell className="font-mono font-medium">{grade.code}</TableCell>
              <TableCell className="font-medium">{grade.majorName}</TableCell>
              <TableCell className="text-center">
                <span className={getGradeColor(grade.value)}>{grade.value.toFixed(2)}</span>
              </TableCell>
              <TableCell className="text-center font-medium">{grade.credit}</TableCell>
              <TableCell className="text-center">
                <Badge className={getMentionColor(grade.mention)} variant="outline">
                  {grade.mention}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
