"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, GraduationCap, Building2 } from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { useCourses } from "@/hooks/useCourses"
import { useMajors } from "@/hooks/useMajors"
import { useLevels } from "@/hooks/useLevels"

export default function AdminDashboard() {
    const { getUsers } = useUsers()
    const { getCourses } = useCourses()
    const { data: majors, isLoading: majorsLoading } = useMajors()
    const { data: levels, isLoading: levelsLoading } = useLevels()
    
    const totalUsers = getUsers.data?.length || 0
    const totalCourses = getCourses.data?.length || 0
    const totalMajors = majors?.length || 0
    const totalLevels = levels?.length || 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
                <p className="text-muted-foreground">Gérez votre plateforme éducative</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getUsers.isLoading ? "..." : totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Utilisateurs enregistrés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getCourses.isLoading ? "..." : totalCourses}</div>
                        <p className="text-xs text-muted-foreground">Cours disponibles</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Filières</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{majorsLoading ? "..." : totalMajors}</div>
                        <p className="text-xs text-muted-foreground">Filières disponibles</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Niveaux</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{levelsLoading ? "..." : totalLevels}</div>
                        <p className="text-xs text-muted-foreground">Niveaux académiques</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}