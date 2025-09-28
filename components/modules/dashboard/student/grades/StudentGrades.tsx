"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useGradesByStudent } from "@/hooks/useGrades"
import { GradeDetails, StudentGradesLoading, DataTable, columns, StudentGradesHeader } from "@/components/modules/dashboard/student/grades"
import { ChartContainer } from "@/components/ui/chart"
import * as Recharts from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GradeResponseData } from "@/types/grade"

export function StudentGrades() {
  const { data: session } = useSession()
  const studentId = session?.user?.id ? Number(session.user.id) : 0
  const { data: grades, isLoading } = useGradesByStudent(studentId)
  const [selectedGrade, setSelectedGrade] = useState<GradeResponseData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDetails = (grade: GradeResponseData) => {
    setSelectedGrade(grade)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setSelectedGrade(null)
    }
  }

  const chartData = React.useMemo(() => {
    if (!grades) return []
    return grades.map((g: GradeResponseData) => ({
      course: g.course?.name,
      value: g.value,
    }))
  }, [grades])

  if (isLoading) {
    return <StudentGradesLoading />
  }

  return (
    <div className="space-y-6">
      <StudentGradesHeader />
      
      <Card>
        <CardHeader>
          <CardTitle>Évolution des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "Note", color: "#2563eb" },
              course: { label: "Matière" },
            }}
            className="w-full h-72"
          >
            <Recharts.LineChart data={chartData} margin={{ top: 16, right: 16, left: 16, bottom: 32 }}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="course" />
              <Recharts.YAxis domain={[0, 20]} />
              <Recharts.Tooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  color: 'hsl(var(--popover-foreground))',
                  border: '1px solid hsl(var(--border))',
                }}
                labelStyle={{
                  color: 'hsl(var(--popover-foreground))',
                }}
                itemStyle={{
                  color: 'hsl(var(--popover-foreground))',
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Recharts.Line type="monotone" dataKey="value" name="Note" stroke="#2563eb" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </Recharts.LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <DataTable 
        columns={columns} 
        data={grades || []} 
        meta={{
          onDetails: handleDetails,
        }}
      />
    
      <GradeDetails 
        grade={selectedGrade}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      />
    </div>
  )
} 