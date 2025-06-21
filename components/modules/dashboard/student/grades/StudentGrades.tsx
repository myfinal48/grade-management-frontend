"use client";
import { useSession } from "next-auth/react";
import { useGrades } from "@/hooks/useGrades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Search } from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import * as Recharts from "recharts";
import { useMemo, useState } from "react";
import type { GradeResponseData } from "@/types/grade";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar } from "lucide-react";

export function StudentGrades() {
  const { data: session } = useSession();
  const studentId = session?.user?.id ? Number(session.user.id) : undefined;
  const { getGradesByStudent } = useGrades({ studentId });
  const { data: grades, isLoading, error, refetch } = getGradesByStudent;

  // Filtrage
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<GradeResponseData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Extraire la liste unique des matières à partir des notes
  const courses = useMemo(() => {
    if (!grades) return [];
    const unique = new Map<number, { id: number; name: string }>();
    grades.forEach((g: GradeResponseData) => {
      if (g.course && !unique.has(g.course.id)) {
        unique.set(g.course.id, { id: g.course.id, name: g.course.name });
      }
    });
    return Array.from(unique.values());
  }, [grades]);

  // Filtrer les notes selon la matière et la recherche
  const filteredGrades = useMemo(() => {
    if (!grades) return [];
    return grades.filter((g: GradeResponseData) => {
      const matchCourse = selectedCourse === "ALL" || String(g.course?.id) === selectedCourse;
      const matchSearch =
        search.trim() === "" ||
        g.course?.name.toLowerCase().includes(search.toLowerCase()) ||
        String(g.value).includes(search);
      return matchCourse && matchSearch;
    });
  }, [grades, selectedCourse, search]);

  // Préparer les données pour le chart
  const chartData = useMemo(() => {
    if (!grades) return [];
    return grades.map((g: GradeResponseData) => ({
      course: g.course?.name,
      value: g.value,
    }));
  }, [grades]);

  const handleRowClick = (grade: GradeResponseData) => {
    setSelectedGrade(grade);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedGrade(null);
  };

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
        {/* Diagramme lignes */}
        <div className="mb-8">
          <ChartContainer
            config={{
              value: { label: "Note", color: "#2563eb" },
              course: { label: "Matière" },
            }}
            className="w-full h-72"
          >
            <Recharts.LineChart data={chartData} margin={{ top: 16, right: 16, left: 16, bottom: 32 }}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="course" />
              <Recharts.YAxis domain={[0, 20]} />
              <Recharts.Tooltip />
              <Recharts.Line type="monotone" dataKey="value" name="Note" stroke="#2563eb" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </Recharts.LineChart>
          </ChartContainer>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toutes les matières</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une note ou matière..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Tableau des notes */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matière</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades && filteredGrades.length > 0 ? (
              filteredGrades.map((grade) => (
                <TableRow
                  key={grade.id}
                  className="hover:bg-accent/30 cursor-pointer"
                  onClick={() => handleRowClick(grade)}
                >
                  <TableCell>{grade.course?.name}</TableCell>
                  <TableCell className="font-medium">{grade.value}/20</TableCell>
                  <TableCell>{new Date(grade.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Aucune note trouv&eacute;e.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Dialog détails note */}
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Détail de la note</DialogTitle>
              <DialogDescription>Informations sur cette note.</DialogDescription>
            </DialogHeader>
            {selectedGrade && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{selectedGrade.course?.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedGrade.course?.code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{selectedGrade.value}/20</div>
                    <Badge variant={selectedGrade.value >= 10 ? "default" : "destructive"}>
                      {selectedGrade.value >= 10 ? "Réussi" : "Échec"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <BookOpen className="h-4 w-4" /> Matière
                    </div>
                    <div className="text-sm">{selectedGrade.course?.name}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <Calendar className="h-4 w-4" /> {"Date d'attribution"}
                    </div>
                    <div className="text-sm">{new Date(selectedGrade.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 