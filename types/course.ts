export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credit: number;
  semesterName: string;
  semesterId: number;
  teacherId: number | null;
  teacherName: string | null;
}

export interface CourseRequestData {
  semesterId: number;
  code: string;
  name: string;
  description: string;
  credit: number;
  teacherId?: number | null;
}

export interface CourseResponseData {
  semesterName: string;
  code: string;
  name: string;
  description: string;
  credit: number;
  teacherId: number;
  teacherName: string;
  id:number
} 