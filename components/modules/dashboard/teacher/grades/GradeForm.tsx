"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGrades } from "@/hooks/useGrades";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const gradeSchema = z.object({
  studentId: z.coerce.number().min(1, "L'étudiant est requis"),
  courseId: z.coerce.number().min(1, "Le cours est requis"),
  value: z.coerce.number().min(0, "La note est requise").max(20, "La note doit être entre 0 et 20"),
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface GradeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<GradeFormData>;
  mode: "create" | "edit";
  gradeId?: number;
}

export function GradeForm({ open, onOpenChange, initialData, mode, gradeId }: GradeFormProps) {
  const { createGrade, updateGrade } = useGrades({ gradeId });
  const [formError, setFormError] = useState<string | null>(null);
  const { getStudents } = useStudents();
  const { getCourses } = useCourses();
  const students = getStudents.data || [];
  const courses = getCourses.data || [];

  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: initialData?.studentId ?? 0,
      courseId: initialData?.courseId ?? 0,
      value: initialData?.value ?? 0,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        studentId: initialData.studentId ?? 0,
        courseId: initialData.courseId ?? 0,
        value: initialData.value ?? 0,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: GradeFormData) => {
    setFormError(null);
    try {
      if (mode === "create") {
        await createGrade.mutateAsync(data);
      } else if (gradeId) {
        await updateGrade.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      setFormError(error?.message || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const isLoading = createGrade.isPending || updateGrade.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Ajouter une note" : "Modifier la note"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Remplissez le formulaire pour ajouter une nouvelle note."
              : "Modifiez les informations de la note."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Étudiant</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={getStudents.isLoading || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un étudiant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getStudents.isLoading ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </div>
                      ) : students.length > 0 ? (
                        students.map((student) => (
                          <SelectItem key={student.id} value={String(student.id)}>
                            {student.firstName} {student.lastName} ({student.email})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground text-sm">Aucun étudiant disponible</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cours</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={getCourses.isLoading || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un cours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getCourses.isLoading ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </div>
                      ) : courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.name} ({course.code})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground text-sm">Aucun cours disponible</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Note sur 20" 
                      min="0"
                      max="20"
                      step="0.5"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : mode === "create" ? "Créer" : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 