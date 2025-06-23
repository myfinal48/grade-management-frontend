import { TeacherCourses } from "@/components/modules/dashboard/teacher/courses";
import { getAuthenticatedUser } from "@/lib/serverAuth";
import { EmptyState } from "@/components/global/EmptyState";

export default async function TeacherCoursesPage() {
  const { session } = await getAuthenticatedUser({ allowedRoles: ["TEACHER"] });
  const teacherId = session?.user?.id ? Number(session.user.id) : undefined;
  if (!teacherId) return <EmptyState title="Utilisateur non authentifié" message="Vous devez être connecté en tant qu'enseignant pour accéder à cette page." />;
  return <TeacherCourses teacherId={teacherId} />;
} 