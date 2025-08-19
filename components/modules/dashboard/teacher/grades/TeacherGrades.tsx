"use client";
import { useState } from "react";
import { useGrades } from "@/hooks/useGrades";
import { useCourses } from "@/hooks/useCourses";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { GridSkeleton } from "@/components/ui/loading-skeletons";
import { GraduationCap, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { GradeForm } from "./GradeForm";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { GradeResponseData } from "@/types/grade";
import type { Course, CourseResponseData } from "@/types/course";

export function TeacherGrades({ teacherId }: { teacherId: number }) {
  const { getGradesByTeacher } = useGrades({ teacherId });
  const { data: grades, isLoading, error, refetch } = getGradesByTeacher;
  const { getByTeacherId } = useCourses({ teacherId });

  const [showDialog, setShowDialog] = useState(false);
  const [editGrade, setEditGrade] = useState<GradeResponseData | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");

  const courses: (Course | CourseResponseData)[] = getByTeacherId.data || [];

  const handleAdd = () => {
    setEditGrade(null);
    setShowDialog(true);
  };

  const handleEdit = (grade: GradeResponseData) => {
    setEditGrade(grade);
    setShowDialog(true);
  };

  const filteredGrades: GradeResponseData[] = (grades || []).filter((grade) => {
    const student = grade.student;
    const course = grade.course as Course | CourseResponseData | undefined;
    if (!course) return false;
    const matchSearch =
      search === "" ||
      student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      student?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      course.name?.toLowerCase().includes(search.toLowerCase()) ||
      course.code?.toLowerCase().includes(search.toLowerCase());
    const matchCourse = selectedCourseId === "ALL" || String(course.id) === selectedCourseId;
    return matchSearch && matchCourse;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 justify-between">
        <div className="flex flex-row items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          <CardTitle>Mes notes attribuées</CardTitle>
        </div>
        <Button variant="default" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter une note
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par étudiant, cours..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filtrer par cours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les cours</SelectItem>
              {courses
                .filter(course => typeof course.id === 'number' && Number.isFinite(course.id) && course.id > 0)
                .map((course) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {isLoading && (
          <GridSkeleton items={3} columns={3} cardHeight="h-32" />
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger vos notes. <button onClick={() => refetch()} className="underline">Réessayer</button>
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGrades.length > 0 ? (
              filteredGrades.map(grade => (
                <Card key={grade.id}>
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div>
                      <CardTitle>{grade.student?.firstName} {grade.student?.lastName}</CardTitle>
                      <CardDescription>Étudiant : {grade.student?.registrationNumber}</CardDescription>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(grade)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">Cours : {grade.course?.name} ({grade.course?.code})</div>
                    <div className="text-sm">Note : <span className="font-bold">{grade.value}</span></div>
                    <div className="text-xs text-muted-foreground mt-2">Attribuée le : {new Date(grade.createdAt).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                Aucune note attribuée pour le moment.
              </div>
            )}
          </div>
        )}
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <GradeForm
          open={showDialog}
          onOpenChange={setShowDialog}
          initialData={editGrade ? {
            studentId: editGrade.student?.id,
            courseId: editGrade.course?.id,
            value: editGrade.value,
          } : undefined}
          mode={editGrade ? "edit" : "create"}
          gradeId={editGrade?.id}
          teacherId={teacherId}
        />
      </Dialog>
    </Card>
  );
} 