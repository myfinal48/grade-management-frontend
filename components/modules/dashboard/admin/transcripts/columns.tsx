"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Transcript } from "@/types/transcript"
import { TranscriptActions } from "./TranscriptActions"

export const columns: ColumnDef<Transcript>[] = [
  {
    accessorKey: "name",
    header: "Étudiant",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.registerNumber}
        </div>
      </div>
    ),
    filterFn: (row, id, value) => {
      const transcript = row.original
      const searchValue = value.toLowerCase()
      return (
        transcript.name.toLowerCase().includes(searchValue) ||
        transcript.registerNumber.toLowerCase().includes(searchValue)
      )
    },
  },
  {
    accessorKey: "major",
    header: "Filière",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.major}</Badge>
    ),
    filterFn: (row, id, value) => {
      const major = row.original.major
      return major.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "level",
    header: "Niveau",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.level}</Badge>
    ),
  },
  {
    accessorKey: "semester",
    header: "Semestre",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="default">{row.original.semester}</Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      const semester = row.original.semester
      return semester.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "universityYear",
    header: "Année Universitaire",
    cell: ({ row }) => (
      <div className="text-center font-mono">
        {row.original.universityYear}
      </div>
    ),
    filterFn: (row, id, value) => {
      const year = row.original.universityYear
      return year.includes(value)
    },
  },
  {
    accessorKey: "averageGenerale",
    header: "Moyenne",
    cell: ({ row }) => {
      const average = row.original.averageGenerale
      return (
        <div className="text-center">
          <div className="font-bold text-lg">{average.toFixed(2)}/20</div>
          <Badge 
            variant={average >= 10 ? "default" : "destructive"} 
            className="text-xs px-1 py-0 h-4 text-[10px]"
          >
            {row.original.generalMention}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "result",
    header: "Résultat",
    cell: ({ row }) => {
      const result = row.original.result
      const getResultVariant = (result: string) => {
        switch (result.toUpperCase()) {
          case "ADMIS":
            return "default"
          case "AJOURNÉ":
          case "AJOURNE":
            return "destructive"
          case "REDOUBLANT":
            return "secondary"
          default:
            return "outline"
        }
      }
      
      const getResultClassName = (result: string) => {
        switch (result.toUpperCase()) {
          case "ADMIS":
            return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
          case "AJOURNÉ":
          case "AJOURNE":
            return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
          case "REDOUBLANT":
            return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
          default:
            return ""
        }
      }
      
      return (
        <Badge 
          variant={getResultVariant(result)}
          className={`font-medium ${getResultClassName(result)}`}
        >
          {result}
        </Badge>
      )
    },
  },
  {
    accessorKey: "creditsValid",
    header: "Crédits",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-medium">
          {row.original.creditsValid}/{row.original.creditsRegistered}
        </div>
        <div className="text-xs text-muted-foreground">
          Total: {row.original.totalCreditsValid}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transcript = row.original
      return <TranscriptActions transcript={transcript} />
    },
  },
]
