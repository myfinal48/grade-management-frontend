"use client";
import { useGrades } from "@/hooks/useGrades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Trash2, RefreshCw, MoreHorizontal, User, BookOpen, Calendar, GraduationCap, Search } from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GradeResponseData } from "@/types/grade";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminGrades() {
  const { getGrades, deleteGrade } = useGrades({});
  const { data: grades, isLoading, error, refetch } = getGrades;
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeResponseData | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  
  // États pour les filtres
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState<string>("ALL");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");

  // Extraction des données uniques pour les filtres
  const teachers = useMemo(() => {
    if (!grades) return [];
    const uniqueTeachers = new Set(grades.map(grade => grade.course?.teacherName).filter(Boolean));
    return Array.from(uniqueTeachers).sort();
  }, [grades]);

  const courses = useMemo(() => {
    if (!grades) return [];
    const uniqueCourses = new Set(grades.map(grade => grade.course?.name).filter(Boolean));
    return Array.from(uniqueCourses).sort();
  }, [grades]);

  // Filtrage des notes
  const filteredGrades = useMemo(() => {
    if (!grades) return [];
    
    return grades.filter(grade => {
      const matchSearch = search === "" || 
        grade.student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        grade.student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        grade.student?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        grade.course?.name?.toLowerCase().includes(search.toLowerCase()) ||
        grade.course?.code?.toLowerCase().includes(search.toLowerCase()) ||
        grade.course?.teacherName?.toLowerCase().includes(search.toLowerCase());
      
      const matchTeacher = teacherFilter === "ALL" || grade.course?.teacherName === teacherFilter;
      const matchCourse = courseFilter === "ALL" || grade.course?.name === courseFilter;
      
      return matchSearch && matchTeacher && matchCourse;
    });
  }, [grades, search, teacherFilter, courseFilter]);

  const handleDelete = async () => {
    if (selectedGradeId) {
      await deleteGrade.mutateAsync(selectedGradeId);
      setSelectedGradeId(null);
      setDeleteDialogOpen(false);
      refetch();
    }
  };

  const handleViewGrade = (grade: GradeResponseData) => {
    setSelectedGrade(grade);
    setViewDetailsOpen(true);
  };

  const handleCloseViewDetails = () => {
    setSelectedGrade(null);
    setViewDetailsOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={5} columns={6} />
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
        <CardTitle>Gestion des notes</CardTitle>
        {/* Filtres et recherche */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center w-full">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par étudiant, cours, professeur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par professeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les professeurs</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par matière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Toutes les matières</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredGrades.length} note{filteredGrades.length !== 1 ? 's' : ''} trouvée{filteredGrades.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 min-w-[180px]">Étudiant</TableHead>
              <TableHead className="w-1/5 min-w-[180px]">Cours</TableHead>
              <TableHead className="w-1/6 min-w-[150px]">Professeur</TableHead>
              <TableHead className="w-1/6 min-w-[100px]">Note</TableHead>
              <TableHead className="w-1/6 min-w-[120px]">Date</TableHead>
              <TableHead className="w-1/6 min-w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades && filteredGrades.length > 0 ? (
              filteredGrades.map((grade) => (
                <TableRow 
                  key={grade.id} 
                  className="hover:bg-accent/30 cursor-pointer"
                  onClick={() => handleViewGrade(grade)}
                >
                  <TableCell className="py-4">
                    <div className="font-medium">
                      {grade.student?.firstName} {grade.student?.lastName}
                    </div>
                    {grade.student?.registrationNumber && (
                      <div className="text-sm text-muted-foreground">
                        {grade.student.registrationNumber}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium">{grade.course?.name}</div>
                    {grade.course?.code && (
                      <div className="text-sm text-muted-foreground">
                        {grade.course.code}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium">{grade.course?.teacherName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Professeur
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-bold text-lg">{grade.value}/20</div>
                    <Badge variant={grade.value >= 10 ? "default" : "destructive"} className="text-xs">
                      {grade.value >= 10 ? "Réussi" : "Échec"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium">
                      {new Date(grade.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(grade.createdAt).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Actions disponibles</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => { 
                            e.stopPropagation();
                            setSelectedGradeId(grade.id); 
                            setDeleteDialogOpen(true); 
                          }}
                          className="text-destructive focus:text-destructive"
                          disabled={deleteGrade.isPending && selectedGradeId === grade.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                        {deleteGrade.isPending && selectedGradeId === grade.id ? "Suppression..." : "Supprimer"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search || teacherFilter !== "ALL" || courseFilter !== "ALL" 
                    ? "Aucune note trouvée avec les filtres actuels." 
                    : "Aucune note trouvée."}
                </TableCell>
              </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Modal de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Voulez-vous vraiment supprimer cette note ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteGrade.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteGrade.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteGrade.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de détails */}
      <Dialog open={viewDetailsOpen} onOpenChange={handleCloseViewDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la note</DialogTitle>
            <DialogDescription>Informations complètes sur cette note.</DialogDescription>
          </DialogHeader>
          {selectedGrade && (
            <div className="space-y-6">
              {/* En-tête avec note */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {selectedGrade.student?.firstName} {selectedGrade.student?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedGrade.course?.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{selectedGrade.value}/20</div>
                  <Badge variant={selectedGrade.value >= 10 ? "default" : "destructive"}>
                    {selectedGrade.value >= 10 ? "Réussi" : "Échec"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations étudiant */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Informations étudiant
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                      <div className="text-sm">{selectedGrade.student?.firstName} {selectedGrade.student?.lastName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="text-sm">{selectedGrade.student?.email}</div>
                    </div>
                  </div>
                </div>

                {/* Informations cours */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Informations cours
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nom du cours</label>
                      <div className="text-sm">{selectedGrade.course?.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Code</label>
                      <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {selectedGrade.course?.code}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Professeur</label>
                      <div className="text-sm">{selectedGrade.course?.teacherName}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informations temporelles */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Informations temporelles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date de création</label>
                    <div className="text-sm">
                      {new Date(selectedGrade.createdAt).toLocaleDateString()} à {new Date(selectedGrade.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dernière modification</label>
                    <div className="text-sm">
                      {new Date(selectedGrade.updatedAt).toLocaleDateString()} à {new Date(selectedGrade.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
} 