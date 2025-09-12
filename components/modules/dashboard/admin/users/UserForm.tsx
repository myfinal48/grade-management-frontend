"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { User } from "@/types/user"
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers"
import { useForm } from "react-hook-form"
import { UserRoles } from "@/types"
import { Eye, EyeOff } from "lucide-react"

const createUserSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  registrationNumber: z.string(),
  role: z.enum([UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT] as const)
}).refine((data) => {
  if (data.role === UserRoles.STUDENT && !data.registrationNumber.trim()) {
    return false;
  }
  return true;
}, {
  message: "Le matricule est requis pour les étudiants",
  path: ["registrationNumber"]
});

const updateUserSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().optional(),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  registrationNumber: z.string(),
  role: z.enum([UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT] as const)
}).refine((data) => {
  if (data.role === UserRoles.STUDENT && !data.registrationNumber.trim()) {
    return false;
  }
  return true;
}, {
  message: "Le matricule est requis pour les étudiants",
  path: ["registrationNumber"]
});

type CreateUserFormData = z.infer<typeof createUserSchema>
type UpdateUserFormData = z.infer<typeof updateUserSchema>

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  mode: "create" | "edit"
}

export function UserForm({ open, onOpenChange, user, mode }: Readonly<UserFormProps>) {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const [showPassword, setShowPassword] = useState(false)

  const getDefaultRegistrationNumber = (role: string) => {
    return role === UserRoles.STUDENT ? (user?.registrationNumber ?? "") : "--"
  }

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(mode === "create" ? createUserSchema : updateUserSchema),
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      registrationNumber: getDefaultRegistrationNumber(user?.role ?? UserRoles.STUDENT),
      role: user?.role ?? UserRoles.STUDENT,
      ...(mode === "create" && { password: "" }),
    },
  })

  const watchedRole = (form.watch("role") as string) ?? UserRoles.STUDENT

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    if (mode === "create") {
      await createUser.mutateAsync(data as CreateUserFormData)
    } else if (user) {
      const payload: Partial<UpdateUserFormData> = { ...(data as UpdateUserFormData) }
      if ("password" in payload && (!payload.password || payload.password.trim() === "")) {
        delete payload.password
      }
      await updateUser.mutateAsync({
        id: user.id,
        data: payload as UpdateUserFormData,
      })
    }
    onOpenChange(false)
    form.reset()
  }

  const isLoading = createUser.isPending || updateUser.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Créer un Nouvel Utilisateur" : "Modifier l'Utilisateur"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajouter un nouvel utilisateur au système."
              : "Modifier les informations de l'utilisateur."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrer le prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrer le nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrer l'email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d&apos;utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrer le nom d'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe{mode === "edit" ? " (optionnel)" : ""}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder={mode === "create" ? "Entrer le mot de passe" : "Laisser vide pour conserver"} 
                          type={showPassword ? "text" : "password"} 
                          {...field}
                          value={(field.value as string | undefined) ?? ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value)
                      if (value === UserRoles.TEACHER || value === UserRoles.ADMIN) {
                        form.setValue("registrationNumber", "--")
                      } else if (value === UserRoles.STUDENT && form.getValues("registrationNumber") === "--") {
                        form.setValue("registrationNumber", "")
                      }
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserRoles).map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={watchedRole === UserRoles.STUDENT ? "Entrer le matricule" : "--"}
                        disabled={watchedRole === UserRoles.TEACHER || watchedRole === UserRoles.ADMIN}
                        {...field}
                        value={watchedRole === UserRoles.STUDENT ? (field.value as string | undefined) ?? "" : "--"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : mode === "create" ? "Créer" : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
