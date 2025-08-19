"use client";
import { useCourses } from "@/hooks/useCourses";
import { useSemesters } from "@/hooks/useSemesters";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { GridSkeleton } from "@/components/ui/loading-skeletons";
import { useState, useMemo } from "react";

export function TeacherCourses({ teacherId }: { teacherId: number }) {
  const [semesterFilter, setSemesterFilter] = useState("all");
  const { getByTeacherId } = useCourses({ teacherId });
  const { data: semesters } = useSemesters();
  const { data: courses, isLoading, error, refetch } = getByTeacherId;
  
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (semesterFilter === "all") return courses;
    
    return courses.filter(course => {
      const semester = semesters?.find(s => s.name === course.semesterName);
      return semester && String(semester.id) === semesterFilter;
    });
  }, [courses, semesterFilter, semesters]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6" />
          <CardTitle>Mes cours assignés</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les semestres</SelectItem>
              {semesters?.map((semester) => (
                <SelectItem key={semester.id} value={String(semester.id)}>
                  {semester.name} - {semester.universityYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <GridSkeleton items={3} columns={3} cardHeight="h-32" />
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger vos cours. <button onClick={() => refetch()} className="underline">Réessayer</button>
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>Code : {course.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">Crédits : {course.credit}</div>
                    <div className="text-xs">{course.description}</div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                Aucun cours assigné pour le moment.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 