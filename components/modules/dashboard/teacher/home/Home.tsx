"use client"

import { BookOpen, Users, FileText } from "lucide-react"
import { useCourses } from "@/hooks/useCourses"
import { useGradesByTeacher } from "@/hooks/useGrades"
import { useSession } from "next-auth/react"
import { HomeCard, HomeCardItem } from "@/components/modules/dashboard/shared"
import type { GradeResponseData } from "@/types/grade"

export function TeacherHome() {
    const { data: session } = useSession()
    const teacherId = session?.user?.id ? Number(session.user.id) : 0
    
    const coursesQuery = useCourses()
    const gradesQuery = useGradesByTeacher({ teacherId })
    
    const { data: allCourses, isLoading: coursesLoading } = coursesQuery
    const { data: teacherGrades, isLoading: gradesLoading } = gradesQuery
    
    const teacherCourses = allCourses?.filter(course => 
        course.teacherId === teacherId
    ) || []
    
    const uniqueStudents = teacherGrades ? 
        new Set(teacherGrades.map((grade: GradeResponseData) => grade.student.id)).size : 0
    
    const totalGrades = teacherGrades?.length || 0

    const cardItems: HomeCardItem[] = [
        { 
            title: "Mes Cours", 
            description: "Cours que vous enseignez", 
            icon: BookOpen, 
            count: teacherCourses.length, 
            isLoading: coursesLoading 
        },
        { 
            title: "Étudiants", 
            description: "Dans tous vos cours", 
            icon: Users, 
            count: uniqueStudents, 
            isLoading: gradesLoading 
        },
        { 
            title: "Évaluations", 
            description: "Notes que vous avez données", 
            icon: FileText, 
            count: totalGrades, 
            isLoading: gradesLoading 
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold">Tableau de bord Enseignant</h1>
                <p className="text-muted-foreground">Gérez vos cours et suivez vos étudiants</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {cardItems.map((item) => (
                    <HomeCard key={item.title} {...item} />
                ))}
            </div>
        </div>
    )
}
