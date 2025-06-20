"use client";
import { useCourses } from "@/hooks/useCourses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BookOpen } from "lucide-react";

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
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