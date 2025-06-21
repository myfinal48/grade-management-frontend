import { userService } from "@/services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/providers";
import { UserRole } from "@/types";
import { UpdateUserRequestData } from "@/types/user";

export const useUsers = ({ userId, role }: { userId?: number; role?: UserRole } = {}) => {
  // Liste des utilisateurs (optionnellement filtrée par rôle)
  const getUsers = useQuery({
    queryKey: ["users", role],
    queryFn: () => userService.getAll(role),
    enabled: true,
  });

  // Détail d'un utilisateur
  const getUser = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getById(userId as number),
    enabled: !!userId,
  });

  // Création
  const createUser = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur créé avec succès");
    },
  });

  // Suppression
  const deleteUser = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur supprimé avec succès");
    },
  });

  // Edition
  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequestData }) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur modifié avec succès");
    },
  });

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
}; 