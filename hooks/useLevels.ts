import { useMutation, useQuery } from "@tanstack/react-query"
import { levelsService } from "@/services/levelsService"
import type { CreateLevelRequest, UpdateLevelRequest } from "@/types/level"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { LevelsCacheKeys } from "./const"

export function useLevels() {
  return useQuery({
    queryKey: [LevelsCacheKeys.Levels],
    queryFn: levelsService.getAllLevels,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLevel(id: number) {
  return useQuery({
    queryKey: [LevelsCacheKeys.Level,id],
    queryFn: () => levelsService.getLevelById(id),
    enabled: !!id,
  })
}

export function useCreateLevel() {
  return useMutation({
    mutationFn: ({ majorId, data }: { majorId: number; data: CreateLevelRequest }) =>
      levelsService.createLevel(majorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Levels] })
      toast.success("Success",{
        description: "Level created successfully",
      })
    },
    onError: (error: unknown) => {
      let message = "Failed to create level";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error("Error", { description: message });
    },
  })
}

export function useUpdateLevel() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLevelRequest }) => levelsService.updateLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Levels] })
      toast.success("Success",{
        description: "Level updated successfully",
      })
    },
    onError: (error: unknown) => {
      let message = "Failed to update level";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error("Error", { description: message });
    },
  })
}

export function useDeleteLevel() {
  return useMutation({
    mutationFn: (id: number) => levelsService.deleteLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Levels] })
      toast.success("Success",{
        description: "Level deleted successfully",
      })
    },
    onError: (error: unknown) => {
      let message = "Failed to delete level";
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast.error("Error", { description: message });
    },
  })
}
