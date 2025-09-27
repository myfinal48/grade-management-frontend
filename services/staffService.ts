import { apiClient } from "@/lib/axios"
import type { Staff, StaffRole } from "@/types/staff"

const BASE_URL = "/staff"

export const staffService = {
  getAllStaff: async (): Promise<Staff[]> => {
    const response = await apiClient.get<Staff[]>(`${BASE_URL}`)
    return response.data
  },

  getStaffByRole: async (role: StaffRole): Promise<Staff[]> => {
    const response = await apiClient.get<Staff[]>(`${BASE_URL}/${role}`)
    return response.data
  },
}
