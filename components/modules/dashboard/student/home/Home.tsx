"use client"

import { BookOpen, TrendingUp } from "lucide-react"
import { useGrades } from "@/hooks/useGrades"
import { useSession } from "next-auth/react"
import { HomeCard, HomeCardItem } from "@/components/modules/dashboard/shared"

export function StudentHome() {
    const { data: session } = useSession()
    const studentId = session?.user?.id ? Number(session.user.id) : undefined
    
    const { getGradesByStudent } = useGrades({ studentId })
    const { data: grades, isLoading } = getGradesByStudent
    
    const totalCourses = grades ? new Set(grades.map(g => g.course.id)).size : 0
    const averageGrade = grades && grades.length > 0 
        ? parseFloat((grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1))
        : 0.0

    const cardItems: HomeCardItem[] = [
        { 
            title: "Cours Inscrits", 
            description: "Cours auxquels vous êtes inscrit", 
            icon: BookOpen, 
            count: totalCourses, 
            isLoading 
        },
        { 
            title: "Moyenne Générale", 
            description: "Moyenne de toutes vos notes", 
            icon: TrendingUp, 
            count: averageGrade, 
            isLoading 
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold">Tableau de bord Étudiant</h1>
                <p className="text-muted-foreground">Suivez vos cours et votre progression</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {cardItems.map((item) => (
                    <HomeCard key={item.title} {...item} />
                ))}
            </div>
        </div>
    )
}
