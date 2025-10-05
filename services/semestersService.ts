import { apiClient } from "@/lib/axios"
import type { Semester, CreateSemesterRequest, UpdateSemesterRequest } from "@/types/semester"

const BASE_URL = "/semesters"

export const semestersService = {
  getAllSemesters: async (): Promise<Semester[]> => {
    const response = await apiClient.get<Semester[]>(`${BASE_URL}`)
    return response.data
  },

  getSemesterById: async (id: number): Promise<Semester> => {
    const response = await apiClient.get<Semester>(`${BASE_URL}/${id}`)
    return response.data
  },

  getSemestersByLevel: async (levelId: number): Promise<Semester[]> => {
    const response = await apiClient.get<Semester[]>(`${BASE_URL}/by-level/${levelId}`)
    return response.data
  },

  createSemester: async (levelId: number, data: CreateSemesterRequest): Promise<Semester> => {
    const response = await apiClient.post<Semester>(`${BASE_URL}?levelId=${levelId}`, data)
    return response.data
  },

  updateSemester: async (id: number, data: UpdateSemesterRequest): Promise<Semester> => {
    const response = await apiClient.put<Semester>(`${BASE_URL}/${id}`, data)
    return response.data
  },

  deleteSemester: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
  },
}
