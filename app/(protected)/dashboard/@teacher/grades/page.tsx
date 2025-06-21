import { TeacherGrades } from "@/components/modules/dashboard/teacher/grades";
import { getAuthenticatedUser } from "@/lib/serverAuth";

export default async function TeacherGradesPage() {
  const { session } = await getAuthenticatedUser({ allowedRoles: ["TEACHER"] });
  const teacherId = session?.user?.id ? Number(session.user.id) : undefined;
  if (!teacherId) return <div>Utilisateur non authentifié.</div>;
  return <TeacherGrades teacherId={teacherId} />;
} 