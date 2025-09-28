import { useMutation, useQuery } from "@tanstack/react-query"
import { levelsService } from "@/services/levelsService"
import type { CreateLevelRequest, UpdateLevelRequest } from "@/types/level"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { LevelsCacheKeys } from "./const"

export function useLevels() {
  return useQuery({
    queryKey: [LevelsCacheKeys.Levels],
    queryFn: levelsService.getAllLevels,
    staleTime: 5 * 60 * 1000,
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
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Level] })
      toast.success("Success",{
        description: "Niveau créé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la création du niveau");
      toast.error("", { description: message });
    },
  })
}

export function useUpdateLevel() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLevelRequest }) => levelsService.updateLevel(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Levels] })
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Level, id] })
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Level] })
      toast.success("Success",{
        description: "Niveau mis à jour avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la mise à jour du niveau");
      toast.error("", { description: message });
    },
  })
}

export function useDeleteLevel() {
  return useMutation({
    mutationFn: (id: number) => levelsService.deleteLevel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Levels] })
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Level, id] })
      queryClient.invalidateQueries({ queryKey: [LevelsCacheKeys.Level] })
      toast.success("Success",{
        description: "Niveau supprimé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Echec de la suppression du niveau");
      toast.error("", { description: message });
    },
  })
}
