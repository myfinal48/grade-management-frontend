import type { UserResponseData } from "./index";
import type { CourseResponseData } from "./course";

export interface GradeResponseData {
  id: number;
  student: UserResponseData;
  course: CourseResponseData;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface GradeRequestData {
  studentId: number;
  courseId: number;
  value: number;
} 