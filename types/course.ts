export interface Course {
  id: number;
  code: string;
  name: string;
  description: number;
  credit: number;
}

export interface CourseRequestData {
  id:number
  semesterId: number;
  code: string;
  name: string;
  description: string;
  credit: number;
}

export interface CourseResponseData {
  semesterName: string;
  code: string;
  name: string;
  description: string;
  credit: number;
  teacherId: number;
  teacherName: string;
} 