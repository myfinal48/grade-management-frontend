import { type UserRole, UserRoles } from "@/types"
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Settings,
    FileText,
    Calendar,
    BarChart3,
    UserCheck,
    School,
    Book,
    Hash,
    LucideListChecks,
} from "lucide-react"

export interface NavigationItem {
    title: string
    href: string
    icon: any
    badge?: string
    roles: UserRole[]
}

export const navigationConfig: NavigationItem[] = [
    {
        title: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
    },
    // Admin specific
    {
        title: "Gestion des utilisateurs",
        href: "/dashboard/users",
        icon: Users,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Gestion des filieres",
        href: "/dashboard/majors",
        icon: Book,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Gestion des niveaux",
        href: "/dashboard/levels",
        icon: Hash,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Gestion des semestres",
        href: "/dashboard/semesters",
        icon: LucideListChecks,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Transcripts",
        href: "/dashboard/transcripts",
        icon: FileText,
        roles: [UserRoles.ADMIN],
    },
    // Teacher specific
    {
        title: "Mes cours",
        href: "/dashboard/my-courses",
        icon: School,
        roles: [UserRoles.TEACHER],
    },
    {
        title: "Étudiants",
        href: "/dashboard/students",
        icon: GraduationCap,
        roles: [UserRoles.TEACHER],
    },
    {
        title: "Évaluations",
        href: "/dashboard/evaluations",
        icon: FileText,
        roles: [UserRoles.TEACHER],
    },
    // Student specific
    {
        title: "Mes cours",
        href: "/dashboard/my-courses",
        icon: BookOpen,
        roles: [UserRoles.STUDENT],
    },
    {
        title: "Planning",
        href: "/dashboard/schedule",
        icon: Calendar,
        roles: [UserRoles.STUDENT],
    },
    {
        title: "Notes",
        href: "/dashboard/grades",
        icon: UserCheck,
        roles: [UserRoles.STUDENT],
    },
    // Common
    {
        title: "Paramètres",
        href: "/dashboard/settings",
        icon: Settings,
        roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
    },
]

export function getNavigationForRole(role: UserRole): NavigationItem[] {
    return navigationConfig.filter((item) => item.roles.includes(role))
}
