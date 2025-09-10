"use client"

import { Users, BookOpen, GraduationCap, Building2 } from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { useCourses } from "@/hooks/useCourses"
import { useMajors } from "@/hooks/useMajors"
import { useLevels } from "@/hooks/useLevels"
import { HomeCard, HomeCardItem } from "@/components/modules/dashboard/shared"

export function AdminHome() {
    const { getUsers } = useUsers()
    const { getCourses } = useCourses()
    const { data: majors, isLoading: majorsLoading } = useMajors()
    const { data: levels, isLoading: levelsLoading } = useLevels()
    
    const totalUsers = getUsers.data?.length || 0
    const totalCourses = getCourses.data?.length || 0
    const totalMajors = majors?.length || 0
    const totalLevels = levels?.length || 0

    

    const cardItems: HomeCardItem[] = [
        { title: "Total Utilisateurs", description: "Utilisateurs enregistrés", icon: Users, count: totalUsers, isLoading: getUsers.isLoading },
        { title: "Cours Actifs", description: "Cours disponibles", icon: BookOpen, count: totalCourses, isLoading: getCourses.isLoading },
        { title: "Filières", description: "Filières disponibles", icon: Building2, count: totalMajors, isLoading: majorsLoading },
        { title: "Niveaux", description: "Niveaux académiques", icon: GraduationCap, count: totalLevels, isLoading: levelsLoading },
    ] 

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold">Tableau de bord Administrateur</h1>
                <p className="text-muted-foreground">Gérez votre plateforme éducative</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cardItems.map((item) => (
                    <HomeCard key={item.title} {...item} />
                ))}
            </div>
        </div>
    )
}