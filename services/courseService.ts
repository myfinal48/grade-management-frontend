import { apiClient } from "@/lib/axios"
import { Course, CourseRequestData } from "@/types/course"

const BASE_URL = '/courses'

export const courseService ={
  getAll: async ()=>{
    const response = await apiClient.get<Course[]>(`${BASE_URL}`)
    return response.data
  },
  getById: async (id:number)=>{
    const response = await apiClient.get<Course>(`${BASE_URL}/${id}`)
    return response.data
  },
  create: async (course:CourseRequestData)=>{
    const response = await apiClient.post<Course>(`${BASE_URL}`,course)
    return response.data
  },
  update: async (id:number,course:CourseRequestData)=>{
    const response = await apiClient.put<Course>(`${BASE_URL}/${id}`,course)
    return response.data
  },
  delete: async (id:number)=>{
    const response = await apiClient.delete<void>(`${BASE_URL}/${id}`)
    return response.data
  },
  getByTeacherId: async (teacherId:number)=>{
    const response = await apiClient.get<Course[]>(`${BASE_URL}/teacher/${teacherId}`)
    return response.data
  },
  assignTeacher: async (courseId:number,teacherId:number)=>{
    const response = await apiClient.put<Course>(`${BASE_URL}/${courseId}/assign/${teacherId}`)
    return response.data
  }
}