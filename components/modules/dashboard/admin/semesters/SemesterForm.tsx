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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import type { Semester } from "@/types/semester"
import { useCreateSemester, useUpdateSemester } from "@/hooks/useSemesters"
import { useLevels } from "@/hooks/useLevels"

const semesterSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    universityYear: z
      .string()
      .min(1, "University year is required")
      .max(50, "University year must be less than 50 characters"),
    levelId: z.number().min(1, "Level is required"),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })

type SemesterFormData = z.infer<typeof semesterSchema>

interface SemesterFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  semester?: Semester
  mode: "create" | "edit"
}

export function SemesterForm({ open, onOpenChange, semester, mode }: SemesterFormProps) {
  const createSemester = useCreateSemester()
  const updateSemester = useUpdateSemester()
  const { data: levels } = useLevels()

  const form = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      universityYear: "",
      levelId: 0,
    },
  })

  useEffect(() => {
    if (open) {
      if (semester) {
        form.reset({
          name: semester.name || "",
          startDate: semester.startDate || "",
          endDate: semester.endDate || "",
          universityYear: semester.universityYear || "",
          levelId: semester.levelId || 0,
        })
      } else {
        form.reset({
          name: "",
          startDate: "",
          endDate: "",
          universityYear: "",
          levelId: 0,
        })
      }
    }
  }, [semester, form, open])

  const onSubmit = async (data: SemesterFormData) => {
      if (mode === "create") {
        await createSemester.mutateAsync({ levelId: data.levelId, data })
      } else if (semester) {
        await updateSemester.mutateAsync({ id: semester.id, data })
      }
      onOpenChange(false)
      form.reset()
  }

  const isLoading = createSemester.isPending || updateSemester.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Semester" : "Edit Semester"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Add a new semester to the system." : "Make changes to the semester information."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter semester name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="universityYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2024-2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels?.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
