import { apiClient } from "@/lib/axios"
import type { University, CreateUniversityRequest, UpdateUniversityRequest } from "@/types/university"

const BASE_URL = "/university-info"

export const universityService = {
  getLogoPresignedUrl: async (filename: string): Promise<{ url: string; objectName: string }> => {
    const resp = await apiClient.post<{ url: string; objectName: string }>(
      `${BASE_URL}/logo/presigned-url?filename=${encodeURIComponent(filename)}`
    )
    return resp.data
  },
  getAllUniversities: async (): Promise<University[]> => {
    const response = await apiClient.get<University[]>(`${BASE_URL}`)
    return response.data
  },

  getUniversityById: async (id: number): Promise<University> => {
    const response = await apiClient.get<University>(`${BASE_URL}/${id}`)
    return response.data
  },

  createUniversity: async (data: CreateUniversityRequest): Promise<University> => {
    let logoObjectName: string | undefined
    if (data.logo) {
      const { url, objectName } = await universityService.getLogoPresignedUrl(data.logo.name)
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": data.logo.type || "application/octet-stream",
        },
        body: data.logo,
      })
      logoObjectName = objectName
    }

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("address", data.address)
    formData.append("phone", data.phone)
    formData.append("website", data.website)
    if (logoObjectName) formData.append("logoObjectName", logoObjectName)

    const response = await apiClient.post<University>(`${BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateUniversity: async (data: UpdateUniversityRequest): Promise<University> => {
    let logoObjectName: string | undefined
    if (data.logo) {
      const { url, objectName } = await universityService.getLogoPresignedUrl(data.logo.name)
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": data.logo.type || "application/octet-stream",
        },
        body: data.logo,
      })
      logoObjectName = objectName
    }

    const formData = new FormData()
    formData.append("id", data.id.toString())
    formData.append("name", data.name)
    formData.append("address", data.address)
    formData.append("phone", data.phone)
    formData.append("website", data.website)
    if (logoObjectName) formData.append("logoObjectName", logoObjectName)

    const response = await apiClient.put<University>(`${BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  deleteUniversity: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`)
  },
}
