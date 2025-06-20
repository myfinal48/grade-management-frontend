import { TeacherCourses } from "@/components/modules/dashboard/teacher/courses";
import { getAuthenticatedUser } from "@/lib/serverAuth";

export default async function TeacherCoursesPage() {
  const { session } = await getAuthenticatedUser({ allowedRoles: ["TEACHER"] });
  const teacherId = session?.user?.id ? Number(session.user.id) : undefined;
  if (!teacherId) return <div>Utilisateur non authentifié.</div>;
  return <TeacherCourses teacherId={teacherId} />;
} 