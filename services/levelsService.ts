import { apiClient } from "@/lib/axios"
import type { Level, CreateLevelRequest, UpdateLevelRequest } from "@/types/level"

const BASE_URL = "/levels"

export const levelsService = {
  // Get all levels
  getAllLevels: async (): Promise<Level[]> => {
    const response = await apiClient.get<Level[]>(`${BASE_URL}`)
    return response.data
  },

  // Get level by ID
  getLevelById: async (id: number): Promise<Level> => {
    const response = await apiClient.get<Level>(`${BASE_URL}/${id}`)
    return response.data
  },

  // Create new level for a major
  createLevel: async (majorId: number, data: CreateLevelRequest): Promise<Level> => {
    const response = await apiClient.post<Level>(`${BASE_URL}/major/${majorId}`, data)
    return response.data
  },

  // Update level
  updateLevel: async (id: number, data: UpdateLevelRequest): Promise<Level> => {
    const response = await apiClient.put<Level>(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Delete level
  deleteLevel: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
  },
}
