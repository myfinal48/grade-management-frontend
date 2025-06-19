import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { UserResponseData } from "@/types";

export const useStudents = () => {
  // À adapter selon l'API réelle : /users?role=STUDENT ou /students
  const getStudents = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await apiClient.get<UserResponseData[]>("/users?role=STUDENT");
      return response.data;
    },
  });

  return { getStudents };
}; 