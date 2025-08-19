"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText } from "lucide-react"
import { useCourses } from "@/hooks/useCourses"
import { useGrades } from "@/hooks/useGrades"
import { useSession } from "next-auth/react"

export default function TeacherDashboard() {
    const { data: session } = useSession()
    const teacherId = session?.user?.id ? Number(session.user.id) : undefined
    
    const { getCourses } = useCourses()
    const { getGradesByTeacher } = useGrades({ teacherId })
    
    const { data: allCourses, isLoading: coursesLoading } = getCourses
    const { data: teacherGrades, isLoading: gradesLoading } = getGradesByTeacher
    
    const teacherCourses = allCourses?.filter(course => 
        course.teacherId === teacherId
    ) || []
    
    const uniqueStudents = teacherGrades ? 
        new Set(teacherGrades.map(grade => grade.student.id)).size : 0
    
    const totalGrades = teacherGrades?.length || 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de bord Enseignant</h1>
                <p className="text-muted-foreground">Gérez vos cours et suivez vos étudiants</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mes Cours</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{coursesLoading ? "..." : teacherCourses.length}</div>
                        <p className="text-xs text-muted-foreground">Cours que vous enseignez</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gradesLoading ? "..." : uniqueStudents}</div>
                        <p className="text-xs text-muted-foreground">Dans tous vos cours</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Évaluations</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gradesLoading ? "..." : totalGrades}</div>
                        <p className="text-xs text-muted-foreground">Notes que vous avez données</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
