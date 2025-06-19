import { apiClient } from "@/lib/axios"
import type { Major, CreateMajorRequest, UpdateMajorRequest } from "@/types/major"

export const majorsService = {
  // Get all majors
  getAllMajors: async (): Promise<Major[]> => {
    const response = await apiClient.get<Major[]>("/majors")
    return response.data
  },

  // Get major by ID
  getMajorById: async (id: number): Promise<Major> => {
    const response = await apiClient.get<Major>(`/majors/${id}`)
    return response.data
  },

  // Create new major
  createMajor: async (data: CreateMajorRequest): Promise<Major> => {
    const response = await apiClient.post<Major>("/majors", data)
    return response.data
  },

  // Update major
  updateMajor: async (id: number, data: UpdateMajorRequest): Promise<Major> => {
    const response = await apiClient.put<Major>(`/majors/${id}`, data)
    return response.data
  },

  // Delete major
  deleteMajor: async (id: number): Promise<void> => {
    await apiClient.delete(`/majors/${id}`)
  },
}
