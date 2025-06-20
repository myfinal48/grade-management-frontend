import { apiClient } from "@/lib/axios";
import { User, RegisterRequest, UpdateUserRequestData } from "@/types/user";
import { UserRole } from "@/types";

const BASE_URL = "/admin/users";

export const userService = {
  getAll: async (role?: UserRole) => {
    const url = role ? `${BASE_URL}?role=${role}` : BASE_URL;
    const response = await apiClient.get<User[]>(url);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<User>(`${BASE_URL}/${id}`);
    return response.data;
  },
  create: async (user: RegisterRequest) => {
    const response = await apiClient.post<User>(`${BASE_URL}`, user);
    return response.data;
  },
  update: async (id: number, user: UpdateUserRequestData) => {
    const response = await apiClient.put<User>(`${BASE_URL}/${id}`, user);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<void>(`${BASE_URL}/${id}`);
    return response.data;
  },
}; 