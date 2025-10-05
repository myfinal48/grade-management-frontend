"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { GradeResponseData } from "@/types/grade"
import { formatDate } from "@/lib/utils"
import { GradeActions } from "./GradeActions"

export const columns: ColumnDef<GradeResponseData>[] = [
  {
    accessorKey: "student",
    header: "Étudiant",
    cell: ({ row }) => {
      const student = row.original.student
      return (
        <div>
          <div className="font-medium">
            {student?.firstName} {student?.lastName}
          </div>
          {student?.registrationNumber && (
            <div className="text-sm text-muted-foreground">
              {student.registrationNumber}
            </div>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const grade = row.original
      const studentName = grade.student ? `${grade.student.firstName} ${grade.student.lastName}` : ""
      return studentName.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "course",
    header: "Cours",
    cell: ({ row }) => {
      const course = row.original.course
      return (
        <div>
          <div className="font-medium">{course?.name}</div>
          {course?.code && (
            <div className="text-sm text-muted-foreground">
              {course.code}
            </div>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const grade = row.original
      const courseName = grade.course?.name || ""
      return courseName.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    id: "teacher",
    header: "Professeur",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.course?.teacherName || "Non assigné"}
      </div>
    ),
    filterFn: (row, id, value) => {
      const grade = row.original
      const teacherName = grade.course?.teacherName || "Non assigné"
      return teacherName.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "value",
    header: "Note",
    cell: ({ row }) => {
      const value = row.original.value
      return (
        <div className="flex flex-col items-start gap-1">
          <div className="font-bold text-lg">{value}/20</div>
          <Badge variant={value >= 10 ? "default" : "destructive"} className="text-xs">
            {value >= 10 ? "Réussi" : "Échec"}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {formatDate(new Date(row.original.createdAt))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const grade = row.original
      const meta = table.options.meta as {
        onEdit?: (grade: GradeResponseData) => void
        onDelete?: (grade: GradeResponseData) => void
      }

      return (
        <GradeActions
          grade={grade}
          onEdit={meta?.onEdit}
          onDelete={meta?.onDelete}
        />
      )
    },
  },
]
