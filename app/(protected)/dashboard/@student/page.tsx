"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp } from "lucide-react"
import { useGrades } from "@/hooks/useGrades"
import { useSession } from "next-auth/react"

export default function StudentDashboard() {
    const { data: session } = useSession()
    const studentId = session?.user?.id ? Number(session.user.id) : undefined
    
    const { getGradesByStudent } = useGrades({ studentId })
    const { data: grades, isLoading } = getGradesByStudent
    
    const totalCourses = grades ? new Set(grades.map(g => g.course.id)).size : 0
    const averageGrade = grades && grades.length > 0 
        ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1)
        : "0.0"

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de bord Étudiant</h1>
                <p className="text-muted-foreground">Suivez vos cours et votre progression</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cours Inscrits</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : totalCourses}</div>
                        <p className="text-xs text-muted-foreground">Cours auxquels vous êtes inscrit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : averageGrade}</div>
                        <p className="text-xs text-muted-foreground">Moyenne de toutes vos notes</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
