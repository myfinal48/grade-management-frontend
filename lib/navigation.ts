import { type UserRole, UserRoles } from "@/types"
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    LucideIcon,
    UserCheck,
    Book,
    Hash,
    LucideListChecks, FileArchive, School,
} from "lucide-react"

export interface NavigationItem {
    title: string
    href: string
    icon: LucideIcon
    badge?: string
    roles: UserRole[]
}

export const navigationConfig: NavigationItem[] = [
    {
        title: "Accueil",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
    },
    // Admin specific
    {
        title: "Filières",
        href: "/dashboard/majors",
        icon: Book,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Niveaux",
        href: "/dashboard/levels",
        icon: Hash,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Semestres",
        href: "/dashboard/semesters",
        icon: LucideListChecks,
        roles: [UserRoles.ADMIN],
    },
    {
      title: "Cours",
      href: "/dashboard/courses",
      icon: BookOpen,
      roles: [UserRoles.ADMIN],
    },
    {
      title: "Notes",
      href: "/dashboard/grades",
      icon: FileText,
      roles: [UserRoles.ADMIN],
    },
    {
        title: "Relevés de notes",
        href: "/dashboard/transcripts",
        icon: FileArchive,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Universités",
        href: "/dashboard/universities",
        icon: School,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Utilisateurs",
        href: "/dashboard/users",
        icon: Users,
        roles: [UserRoles.ADMIN],
    },
     {
        title: "Envoyer un Email",
        href: "/dashboard/emails",
        icon: FileText,
        roles: [UserRoles.ADMIN],
    },
   
  
    // Teacher specific
    {
        title: "Notes",
        href: "/dashboard/grades",
        icon: FileText,
        roles: [UserRoles.TEACHER],
    },
    {
        title: "Mes cours",
        href: "/dashboard/courses",
        icon: BookOpen,
        roles: [UserRoles.TEACHER],
    },
    // Student specific
    {
        title: "Notes",
        href: "/dashboard/grades",
        icon: UserCheck,
        roles: [UserRoles.STUDENT],
    },
]

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig.filter((item) => item.roles.includes(role))
}
