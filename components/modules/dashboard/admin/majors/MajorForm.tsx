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
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Major } from "@/types/major"
import { useCreateMajor, useUpdateMajor } from "@/hooks/useMajors"

const majorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
})

type MajorFormData = z.infer<typeof majorSchema>

interface MajorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  major?: Major
  mode: "create" | "edit"
}

export function MajorForm({ open, onOpenChange, major, mode }: MajorFormProps) {
  const createMajor = useCreateMajor()
  const updateMajor = useUpdateMajor()

  const form = useForm<MajorFormData>({
    resolver: zodResolver(majorSchema),
    defaultValues: {
      name: major?.name || "",
      description: major?.description || "",
    },
  })

  const onSubmit = async (data: MajorFormData) => {
      if (mode === "create") {
        await createMajor.mutateAsync(data)
      } else if (major) {
        await updateMajor.mutateAsync({ id: major.id, data })
      }
      onOpenChange(false)
      form.reset()
  }

  const isLoading = createMajor.isPending || updateMajor.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Major" : "Edit Major"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Add a new major to the system." : "Make changes to the major information."}
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
                    <Input placeholder="Enter major name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter major description" className="resize-none" rows={3} {...field} />
                  </FormControl>
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
