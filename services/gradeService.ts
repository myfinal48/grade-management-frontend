import { apiClient } from "@/lib/axios"
import { GradeRequestData, GradeResponseData } from "@/types/grade"

const BASE_URL = '/grades'

export const gradeService = {
  getAll: async () => {
    const response = await apiClient.get<GradeResponseData[]>(`${BASE_URL}`)
    return response.data
  },
  getById: async (id: number) => {
    const response = await apiClient.get<GradeResponseData>(`${BASE_URL}/${id}`)
    return response.data
  },
  create: async (grade: GradeRequestData) => {
    const response = await apiClient.post<GradeResponseData>(`${BASE_URL}`, grade)
    return response.data
  },
  update: async (id: number, grade: GradeRequestData) => {
    const response = await apiClient.put<GradeResponseData>(`${BASE_URL}/${id}`, grade)
    return response.data
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<void>(`${BASE_URL}/${id}`)
    return response.data
  },
  getByStudentId: async (studentId: number) => {
    const response = await apiClient.get<GradeResponseData[]>(`${BASE_URL}/student/${studentId}`)
    return response.data
  },
  getByTeacherId: async (teacherId: number) => {
    const response = await apiClient.get<GradeResponseData[]>(`${BASE_URL}/teacher/${teacherId}`)
    return response.data
  },
  
}