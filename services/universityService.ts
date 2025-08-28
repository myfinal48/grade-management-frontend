import { apiClient } from "@/lib/axios"
import type { University, CreateUniversityRequest, UpdateUniversityRequest } from "@/types/university"

export const universityService = {
  getAllUniversities: async (): Promise<University[]> => {
    const response = await apiClient.get<University[]>("/university-info")
    return response.data
  },

  getUniversityById: async (id: number): Promise<University> => {
    const response = await apiClient.get<University>(`/university-info/${id}`)
    return response.data
  },

  createUniversity: async (data: CreateUniversityRequest): Promise<University> => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("address", data.address)
    formData.append("phone", data.phone)
    formData.append("website", data.website)

    if (data.logo) {
      formData.append("logo", data.logo)
    }

    const response = await apiClient.post<University>("/university-info", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateUniversity: async (data: UpdateUniversityRequest): Promise<University> => {
    const formData = new FormData()
    formData.append("id", data.id.toString())
    formData.append("name", data.name)
    formData.append("address", data.address)
    formData.append("phone", data.phone)
    formData.append("website", data.website)

    if (data.logo) {
      formData.append("logo", data.logo)
    }

    const response = await apiClient.put<University>("/university-info", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  deleteUniversity: async (id: number): Promise<void> => {
    await apiClient.delete(`/university-info/${id}`)
  },
}
