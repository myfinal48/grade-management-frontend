"use client";
import { useSession } from "next-auth/react";
import { useGrades } from "@/hooks/useGrades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeletons";

export function StudentGrades() {
  const { data: session } = useSession();
  const studentId = session?.user?.id ? Number(session.user.id) : undefined;
  const { getGradesByStudent } = useGrades({ studentId });
  const { data: grades, isLoading, error, refetch } = getGradesByStudent;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes notes</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={3} columns={3} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
        Erreur lors du chargement des notes.
          <button onClick={() => refetch()} className="ml-2 underline flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cours</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {grades && grades.length > 0 ? (
                grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.course?.name}</TableCell>
                  <TableCell className="font-medium">{grade.value}/20</TableCell>
                  <TableCell>{new Date(grade.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
                ))
              ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Aucune note trouvée.
                </TableCell>
              </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 