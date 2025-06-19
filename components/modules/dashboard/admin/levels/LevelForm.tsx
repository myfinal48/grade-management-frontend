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
import type { Level } from "@/types/level"
import { useCreateLevel, useUpdateLevel } from "@/hooks/useLevels"
import { useMajors } from "@/hooks/useMajors"

const levelSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  majorId: z.number().min(1, "Major is required"),
})

type LevelFormData = z.infer<typeof levelSchema>

interface LevelFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level?: Level
  mode: "create" | "edit"
}

export function LevelForm({ open, onOpenChange, level, mode }: LevelFormProps) {
  const createLevel = useCreateLevel()
  const updateLevel = useUpdateLevel()
  const { data: majors } = useMajors()

  const form = useForm<LevelFormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      name: level?.name || "",
      majorId: level?.majorId || 0,
    },
  })

  const onSubmit = async (data: LevelFormData) => {
    try {
      if (mode === "create") {
        await createLevel.mutateAsync({ majorId: data.majorId, data })
      } else if (level) {
        await updateLevel.mutateAsync({ id: level.id, data })
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // Error handling is done in the hooks
    }
  }

  const isLoading = createLevel.isPending || updateLevel.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Level" : "Edit Level"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Add a new level to the system." : "Make changes to the level information."}
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
                    <Input placeholder="Enter level name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="majorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Major</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a major" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {majors?.map((major) => (
                        <SelectItem key={major.id} value={major.id.toString()}>
                          {major.name}
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
