"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import type { Course } from "@/types/course"
import { DeleteCourseDialog } from "@/components/modules/dashboard/admin/courses/DeleteCourseDialog"
import { CourseForm } from "./CourseForm"
import { useCourses } from "@/hooks/useCourses"
import { useUsers } from "@/hooks/useUsers"
import { useSemesters } from "@/hooks/useSemesters"
import { UserRoles } from "@/types"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const { assignTeacher } = useCourses({ courseId: course.id })
  const { getUsers } = useUsers({ role: UserRoles.TEACHER })
  const { data: semesters } = useSemesters()
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null)

  const semesterName = course.semesterName
  const semesterId = semesters?.find(s => s.name === semesterName)?.id ?? 1

  const courseForForm = {
    id: course.id,
    code: course.code,
    name: course.name,
    description: String(course.description ?? ""),
    credit: course.credit,
    semesterId,
  }

  const teacherName = course.teacherName || null

  const handleAssign = () => {
    if (selectedTeacherId) {
      assignTeacher.mutate({ courseId: course.id, teacherId: selectedTeacherId }, {
        onSuccess: () => setShowAssignDialog(false)
      })
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{course.name}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Code: {course.code}
              </Badge>
              {teacherName && (
                <div className="text-xs mt-1">Enseignant: {teacherName}</div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Assigner un enseignant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">{course.description}</CardDescription>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CourseForm open={showEditDialog} onOpenChange={setShowEditDialog} course={courseForForm} mode="edit" />

      <DeleteCourseDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} course={course} />

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un enseignant</DialogTitle>
            <DialogDescription>
              Sélectionnez un enseignant à assigner à ce cours.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Select
              value={selectedTeacherId ? String(selectedTeacherId) : ""}
              onValueChange={val => setSelectedTeacherId(val ? Number(val) : null)}
              disabled={getUsers.isLoading || getUsers.data?.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Enseignants</SelectLabel>
                  {getUsers.data?.map(teacher => (
                    <SelectItem key={teacher.id} value={String(teacher.id)}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="default"
              onClick={handleAssign}
              disabled={!selectedTeacherId || assignTeacher.isPending}
            >
              Assigner
            </Button>
            <DialogClose asChild>
              <Button size="sm" variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 