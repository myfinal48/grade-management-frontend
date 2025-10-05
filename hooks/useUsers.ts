import { useMutation, useQuery } from "@tanstack/react-query"
import { userService } from "@/services/userService"
import type { RegisterRequest, UpdateUserRequestData } from "@/types/user"
import type { ApiError } from "@/lib/axios"
import { getErrorMessage } from "@/lib/axios"
import { toast } from "sonner"
import { queryClient } from "@/providers"
import { UsersCacheKeys } from "./const"
import { UserRole } from "@/types"

export function useUsers(role?: UserRole) {
  return useQuery({
    queryKey: [UsersCacheKeys.Users, role],
    queryFn: () => userService.getAll(role),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: [UsersCacheKeys.User, id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.Users] })
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.User] })
      toast.success("Success", {
        description: "Utilisateur créé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la création de l'utilisateur")
      toast.error("", { description: message })
    },
  })
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequestData }) => userService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.Users] })
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.User, id] })
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.User] })
      toast.success("Success", {
        description: "Utilisateur mis à jour avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la mise à jour de l'utilisateur")
      toast.error("", { description: message })
    },
  })
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.Users] })
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.User, id] })
      queryClient.invalidateQueries({ queryKey: [UsersCacheKeys.User] })
      toast.success("Success", {
        description: "Utilisateur supprimé avec succès",
      })
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error, "Échec de la suppression de l'utilisateur")
      toast.error("", { description: message })
    },
  })
}