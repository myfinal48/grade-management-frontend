"use client";
import { TeacherGrades } from "@/components/modules/dashboard/teacher/grades";
import { useSession } from "next-auth/react";

export default function TeacherGradesPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  const teacherId = session?.user?.id;
  return <TeacherGrades teacherId={Number(teacherId)} />;
} 