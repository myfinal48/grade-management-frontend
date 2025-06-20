import { apiClient } from "@/lib/axios"
import type { Major, CreateMajorRequest, UpdateMajorRequest } from "@/types/major"

const BASE_URL = "/majors"

export const majorsService = {
  // Get all majors
  getAllMajors: async (): Promise<Major[]> => {
    const response = await apiClient.get<Major[]>(`${BASE_URL}`)
    return response.data
  },

  // Get major by ID
  getMajorById: async (id: number): Promise<Major> => {
    const response = await apiClient.get<Major>(`${BASE_URL}/${id}`)
    return response.data
  },

  // Create new major
  createMajor: async (data: CreateMajorRequest): Promise<Major> => {
    const response = await apiClient.post<Major>(`${BASE_URL}`, data)
    return response.data
  },

  // Update major
  updateMajor: async (id: number, data: UpdateMajorRequest): Promise<Major> => {
    const response = await apiClient.put<Major>(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Delete major
  deleteMajor: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
  },
}
