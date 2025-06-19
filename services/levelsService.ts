import { apiClient } from "@/lib/axios"
import type { Level, CreateLevelRequest, UpdateLevelRequest } from "@/types/level"

export const levelsService = {
  // Get all levels
  getAllLevels: async (): Promise<Level[]> => {
    const response = await apiClient.get<Level[]>("/levels")
    return response.data
  },

  // Get level by ID
  getLevelById: async (id: number): Promise<Level> => {
    const response = await apiClient.get<Level>(`/levels/${id}`)
    return response.data
  },

  // Create new level for a major
  createLevel: async (majorId: number, data: CreateLevelRequest): Promise<Level> => {
    const response = await apiClient.post<Level>(`/levels/major/${majorId}`, data)
    return response.data
  },

  // Update level
  updateLevel: async (id: number, data: UpdateLevelRequest): Promise<Level> => {
    const response = await apiClient.put<Level>(`/levels/${id}`, data)
    return response.data
  },

  // Delete level
  deleteLevel: async (id: number): Promise<void> => {
    await apiClient.delete(`/levels/${id}`)
  },
}
