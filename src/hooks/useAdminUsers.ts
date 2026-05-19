import { useEffect, useState } from "react";
import type { AlertColor } from "@mui/material";
import type { User, UserRole } from "../interfaces/user.interface";
import { getAllUsers, updateUserRole } from "../services/userService";

// Hook que centraliza la lógica de administración de usuarios
export const useAdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

    const [error, setError] = useState("");

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>("USER");
    const [openDialog, setOpenDialog] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<AlertColor>("success");
    const [openMessage, setOpenMessage] = useState(false);

    // Muestra mensajes temporales de éxito o error
    const showMessage = (text: string, type: AlertColor = "success") => {
        setMessage(text);
        setMessageType(type);
        setOpenMessage(true);
    };

    // Cierra el mensaje temporal
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Carga todos los usuarios registrados desde el backend
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllUsers();

            setUsers(data.users);
        } catch (error) {
            console.error(error);
            setError(
                "Error al cargar los usuarios. Verifica que el usuario tenga rol ADMIN."
            );
        } finally {
            setLoading(false);
        }
    };

    // Abre el modal para cambiar el rol del usuario seleccionado
    const openChangeRoleDialog = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setOpenDialog(true);
    };

    // Cierra el modal y limpia el usuario seleccionado
    const closeChangeRoleDialog = () => {
        setSelectedUser(null);
        setSelectedRole("USER");
        setOpenDialog(false);
    };

    // Actualiza el rol seleccionado dentro del modal
    const changeSelectedRole = (role: UserRole) => {
        setSelectedRole(role);
    };

    // Envía al backend el nuevo rol del usuario seleccionado
    const updateRole = async () => {
        if (!selectedUser) return;

        try {
            setUpdatingUserId(selectedUser.id);
            setError("");

            const data = await updateUserRole(selectedUser.id, selectedRole);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id
                        ? {
                            ...user,
                            role: data.user.role,
                        }
                        : user
                )
            );

            showMessage("Rol actualizado correctamente.", "success");
            closeChangeRoleDialog();
        } catch (error) {
            console.error(error);
            showMessage("Error al actualizar el rol del usuario.", "error");
        } finally {
            setUpdatingUserId(null);
        }
    };

    // Muestra mensaje informativo para carga masiva pendiente
    const bulkUploadPending = () => {
        showMessage("Función de carga masiva pendiente por desarrollar.", "info");
    };

    // Carga los usuarios cuando se abre la vista
    useEffect(() => {
        loadUsers();
    }, []);

    return {
        users,
        loading,
        error,
        updatingUserId,

        selectedUser,
        selectedRole,
        openDialog,

        message,
        messageType,
        openMessage,

        loadUsers,
        openChangeRoleDialog,
        closeChangeRoleDialog,
        changeSelectedRole,
        updateRole,
        bulkUploadPending,
        closeMessage,
    };
};