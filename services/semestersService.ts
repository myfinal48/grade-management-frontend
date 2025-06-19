import { apiClient } from "@/lib/axios"
import type { Semester, CreateSemesterRequest, UpdateSemesterRequest } from "@/types/semester"

const BASE_URL = "/semesters"

export const semestersService = {
  // Get all semesters
  getAllSemesters: async (): Promise<Semester[]> => {
    const response = await apiClient.get<Semester[]>(`${BASE_URL}`)
    return response.data
  },

  // Get semester by ID
  getSemesterById: async (id: number): Promise<Semester> => {
    const response = await apiClient.get<Semester>(`${BASE_URL}/${id}`)
    return response.data
  },

  // Get semesters by level
  getSemestersByLevel: async (levelId: number): Promise<Semester[]> => {
    const response = await apiClient.get<Semester[]>(`${BASE_URL}/by-level/${levelId}`)
    return response.data
  },

  // Create new semester
  createSemester: async (levelId: number, data: CreateSemesterRequest): Promise<Semester> => {
    const response = await apiClient.post<Semester>(`${BASE_URL}?levelId=${levelId}`, data)
    return response.data
  },

  // Update semester
  updateSemester: async (id: number, data: UpdateSemesterRequest): Promise<Semester> => {
    const response = await apiClient.put<Semester>(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Delete semester
  deleteSemester: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
  },
}
