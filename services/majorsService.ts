import { apiClient } from "@/lib/axios"
import type { Major, CreateMajorRequest, UpdateMajorRequest } from "@/types/major"

const BASE_URL = "/majors"

export const majorsService = {
  getAllMajors: async (): Promise<Major[]> => {
    const response = await apiClient.get<Major[]>(`${BASE_URL}`)
    return response.data
  },

  getMajorById: async (id: number): Promise<Major> => {
    const response = await apiClient.get<Major>(`${BASE_URL}/${id}`)
    return response.data
  },

  createMajor: async (data: CreateMajorRequest): Promise<Major> => {
    const response = await apiClient.post<Major>(`${BASE_URL}`, data)
    return response.data
  },

  updateMajor: async (id: number, data: UpdateMajorRequest): Promise<Major> => {
    const response = await apiClient.put<Major>(`${BASE_URL}/${id}`, data)
    return response.data
  },

  deleteMajor: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
  },
}
