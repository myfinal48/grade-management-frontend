"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { CourseForm } from "./CourseForm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsers } from "@/hooks/useUsers"
import { UserRoles } from "@/types"

interface CoursesHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
  teacherFilter: string
  onTeacherFilterChange: (teacherId: string) => void
}

export function CoursesHeader({ searchQuery, onSearchChange, totalCount, teacherFilter, onTeacherFilterChange }: CoursesHeaderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { getUsers } = useUsers({ role: UserRoles.TEACHER })

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses Management</h1>
          <p className="text-muted-foreground">Manage courses in the system ({totalCount} total)</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={teacherFilter} onValueChange={onTeacherFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by teacher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All teachers</SelectItem>
            {getUsers.data?.map((teacher) => (
              <SelectItem key={teacher.id} value={String(teacher.id)}>
                {teacher.firstName} {teacher.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CourseForm open={showCreateDialog} onOpenChange={setShowCreateDialog} mode="create" />
    </>
  )
} 