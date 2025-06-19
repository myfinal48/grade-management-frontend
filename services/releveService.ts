import { apiClient } from "@/lib/axios";
import { ReleveDto } from "@/types";



export const fetchReleve = async (studentId: string, niveauId: string): Promise<ReleveDto> => {
  const response = await apiClient.get(`/releve/${studentId}/${niveauId}`);
  return response.data;
};
