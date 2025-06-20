"use client";
import { useState, useMemo } from "react";
import { useGrades } from "@/hooks/useGrades";
import { useUsers } from "@/hooks/useUsers";
import { useCourses } from "@/hooks/useCourses";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, MoreHorizontal, Search } from "lucide-react";
import { GradeForm } from "./GradeForm";
import { GradeResponseData } from "@/types/grade";

export function TeacherGrades({ teacherId }: { teacherId: number }) {
  // Hooks
  const { getGradesByTeacher, deleteGrade } = useGrades({ teacherId });
  const { data: grades, isLoading, error, refetch } = getGradesByTeacher;
  const { getUsers: getStudents } = useUsers({ role: "STUDENT" });
  const { getByTeacherId: getCoursesByTeacher } = useCourses({ teacherId });
  const students = getStudents.data || [];
  const courses = getCoursesByTeacher.data || [];

  // UI State
  const [showDialog, setShowDialog] = useState(false);
  const [editGrade, setEditGrade] = useState<GradeResponseData | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Filtrage
  const filteredGrades = useMemo(() => {
    if (!grades) return [];
    return grades.filter((grade) => {
      const student = grade.student;
      const course = grade.course;
      const matchSearch =
        search === "" ||
        student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        student?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        course?.name?.toLowerCase().includes(search.toLowerCase()) ||
        course?.code?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [grades, search]);

  // Actions
  const handleDelete = async (id: number) => {
    await deleteGrade.mutateAsync(id);
    setDeleteId(null);
    refetch();
  };

  // Render
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mes notes</CardTitle>
        <Button variant="default" size="sm" onClick={() => { setEditGrade(null); setShowDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter une note
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par étudiant, cours..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Erreur lors du chargement des notes.
              <Button variant="link" size="sm" onClick={() => refetch()} className="ml-2">Réessayer</Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Aucune note trouvée.</TableCell>
                </TableRow>
              ) : filteredGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.student?.firstName} {grade.student?.lastName} <Badge variant="secondary" className="ml-2">{grade.student?.registrationNumber}</Badge></TableCell>
                  <TableCell>{grade.course?.name} <span className="text-xs text-muted-foreground">({grade.course?.code})</span></TableCell>
                  <TableCell>{grade.value}</TableCell>
                  <TableCell>{new Date(grade.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => { setEditGrade(grade); setShowDialog(true); }}>
                          <Pencil className="h-4 w-4 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(grade.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editGrade ? "Modifier la note" : "Ajouter une note"}</DialogTitle>
          </DialogHeader>
          <GradeForm
            open={showDialog}
            onOpenChange={setShowDialog}
            initialData={editGrade ? {
              studentId: editGrade.student?.id,
              value: editGrade.value,
            } : undefined}
            mode={editGrade ? "edit" : "create"}
            gradeId={editGrade?.id}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
} 