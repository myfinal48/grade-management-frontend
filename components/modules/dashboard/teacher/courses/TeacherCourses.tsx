"use client";
import { useCourses } from "@/hooks/useCourses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BookOpen } from "lucide-react";
import { GridSkeleton } from "@/components/ui/loading-skeletons";

export function TeacherCourses({ teacherId }: { teacherId: number }) {
  const { getByTeacherId } = useCourses({ teacherId });
  const { data: courses, isLoading, error, refetch } = getByTeacherId;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <BookOpen className="w-6 h-6" />
        <CardTitle>Mes cours assignés</CardTitle>
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
            {courses && courses.length > 0 ? (
              courses.map(course => (
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