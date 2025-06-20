"use client";
import { useUsers } from "@/hooks/useUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Trash2, Edit, MoreHorizontal, Info } from "lucide-react";
import { useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserRoles } from "@/types";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function AdminUsers() {
  const { getUsers, deleteUser, updateUser, createUser } = useUsers();
  const { data: users, isLoading, error, refetch } = getUsers;
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState<any>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    registrationNumber: "",
    role: "STUDENT"
  });
  const [showUserInfo, setShowUserInfo] = useState<any | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // Filtrage côté front-end
  const filteredUsers = (users || []).filter(user => {
    const matchRole = roleFilter === "ALL" ? true : user.role === roleFilter;
    const matchSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.registrationNumber.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteUser.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          refetch();
        },
        onError: () => setDeleteId(null),
      });
    }
  };

  const handleEdit = (user: any) => {
    setEditUser(user);
    setEditForm({ ...user });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser && editForm) {
      updateUser.mutate({ id: editUser.id, data: { ...editForm, role: editForm.role } }, {
        onSuccess: () => {
          setEditUser(null);
          setEditForm(null);
          refetch();
        },
      });
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(createForm, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setCreateForm({
          username: "",
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          registrationNumber: "",
          role: "STUDENT"
        });
        refetch();
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-2 md:items-center w-full">
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <div className="flex gap-2 w-full md:w-auto md:ml-4">
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous</SelectItem>
                {Object.values(UserRoles).map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un utilisateur</DialogTitle>
              <DialogDescription>Remplissez le formulaire pour ajouter un nouvel utilisateur.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input name="firstName" value={createForm.firstName} onChange={handleCreateChange} placeholder="Prénom" required />
              <Input name="lastName" value={createForm.lastName} onChange={handleCreateChange} placeholder="Nom" required />
              <Input name="email" value={createForm.email} onChange={handleCreateChange} placeholder="Email" required type="email" />
              <Input name="username" value={createForm.username} onChange={handleCreateChange} placeholder="Nom d'utilisateur" required />
              <Input name="registrationNumber" value={createForm.registrationNumber} onChange={handleCreateChange} placeholder="Matricule" required />
              <Input name="password" value={createForm.password} onChange={handleCreateChange} placeholder="Mot de passe" required type="password" />
              <Select name="role" value={createForm.role} onValueChange={val => setCreateForm({ ...createForm, role: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRoles).map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit" disabled={createUser.isPending}>Créer</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Annuler</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger les utilisateurs. <button onClick={() => refetch()} className="underline">Réessayer</button>
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 min-w-[180px]">Nom</TableHead>
                <TableHead className="w-1/4 min-w-[180px]">Email</TableHead>
                <TableHead className="w-1/6 min-w-[120px]">Rôle</TableHead>
                <TableHead className="w-1/6 min-w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent/30 cursor-pointer" onClick={() => setShowUserInfo(user)}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); setShowUserInfo(user); }}>
                              <Info className="h-4 w-4 mr-2" />Détails
                            </DropdownMenuItem>
                          <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); handleEdit(user); }}>
                              <Edit className="h-4 w-4 mr-2" />Éditer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); handleDelete(user.id); }} variant="destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-2">Aucun utilisateur trouvé.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Modal d'édition */}
      <Dialog open={!!editUser} onOpenChange={open => { if (!open) setEditUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Modifiez les informations de l'utilisateur puis validez.</DialogDescription>
          </DialogHeader>
          {editForm && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input name="firstName" value={editForm.firstName} onChange={handleEditChange} placeholder="Prénom" required />
              <Input name="lastName" value={editForm.lastName} onChange={handleEditChange} placeholder="Nom" required />
              <Input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" required type="email" />
              <Input name="username" value={editForm.username} onChange={handleEditChange} placeholder="Nom d'utilisateur" required />
              <Input name="registrationNumber" value={editForm.registrationNumber} onChange={handleEditChange} placeholder="Matricule" />
              <Select name="role" value={editForm.role} onValueChange={val => setEditForm({ ...editForm, role: val })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Rôle" /></SelectTrigger>
                <SelectContent>
                  {Object.values(UserRoles).map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit" disabled={updateUser.isPending}>{updateUser.isPending ? "Sauvegarde..." : "Valider"}</Button>
                <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de suppression */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal d'infos utilisateur */}
      <Dialog open={!!showUserInfo} onOpenChange={open => { if (!open) setShowUserInfo(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informations utilisateur</DialogTitle>
            <DialogDescription>Voici les informations détaillées de l'utilisateur.</DialogDescription>
          </DialogHeader>
          {showUserInfo && (
            <div className="space-y-2">
              <div><span className="font-semibold">Nom :</span> {showUserInfo.firstName} {showUserInfo.lastName}</div>
              <div><span className="font-semibold">Email :</span> {showUserInfo.email}</div>
              <div><span className="font-semibold">Nom d'utilisateur :</span> {showUserInfo.username}</div>
              <div><span className="font-semibold">Matricule :</span> {showUserInfo.registrationNumber}</div>
              <div><span className="font-semibold">Rôle :</span> {showUserInfo.role}</div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 