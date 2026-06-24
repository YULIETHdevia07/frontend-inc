import { useEffect, useState } from "react";
import type { AlertColor } from "@mui/material";
import type { User, UserRole } from "../../interfaces/users/user.interface";
import type { BulkUploadResult } from "../../interfaces/users/bulkUpload.interface";
import {
    getAllUsers,
    updateUserRole,
    uploadUsersBulk,
} from "../../services/users/userService";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

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

    const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
    const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
    const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
    const [bulkUploadCompleted, setBulkUploadCompleted] = useState(false);
    const [bulkUploadResult, setBulkUploadResult] =
        useState<BulkUploadResult<User> | null>(null);


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
    const loadUsers = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const data = await getAllUsers();

            setUsers(data.users);
        } catch (error) {
            console.error(error);
            setError(
                "Error al cargar los usuarios. Verifica que el usuario tenga rol ADMIN."
            );
        } finally {
            if (showLoading) {
                setLoading(false);
            }
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

    // Abre el modal de carga masiva de usuarios
    const openBulkUpload = () => {
        setOpenBulkUploadDialog(true);
    };

    // Cierra el modal de carga masiva y limpia el archivo seleccionado
    const closeBulkUpload = () => {
        setOpenBulkUploadDialog(false);
        setBulkUploadFile(null);
        setBulkUploadResult(null);
        setBulkUploadCompleted(false);
    };

    // Limpia el resultado anterior de la carga masiva
    const clearBulkUploadResult = () => {
        setBulkUploadResult(null);
    };

    // Guarda el archivo Excel seleccionado
    const changeBulkUploadFile = (file: File | null) => {
        setBulkUploadFile(file);
        setBulkUploadResult(null);
        setBulkUploadCompleted(false);
    };

    // Envía el archivo Excel al backend para registrar usuarios
    const uploadBulkUsers = async () => {
        if (!bulkUploadFile) {
            showMessage("Debe seleccionar un archivo Excel.", "warning");
            return;
        }

        try {
            setBulkUploadLoading(true);
            setBulkUploadResult(null);

            const data = await uploadUsersBulk(bulkUploadFile);
            const result = data.result;

            setBulkUploadResult(result);

            if (result.totalErrors > 0) {
                showMessage(
                    result.message ||
                    `El archivo contiene ${result.totalErrors} error(es). No se registraron usuarios.`,
                    "warning"
                );
                return;
            }

            showMessage(
                `Carga masiva exitosa. Usuarios creados: ${result.totalCreated}.`,
                "success"
            );

            // Bloquea el botón para evitar subir el mismo archivo otra vez.
            setBulkUploadCompleted(true);


            await loadUsers(false);
        } catch (error) {
            console.error(error);
            showMessage(getErrorMessage(error), "error");
        } finally {
            setBulkUploadLoading(false);
        }
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

        openBulkUploadDialog,
        bulkUploadFile,
        bulkUploadLoading,
        bulkUploadResult,

        loadUsers,
        openChangeRoleDialog,
        closeChangeRoleDialog,
        changeSelectedRole,
        updateRole,

        openBulkUpload,
        closeBulkUpload,
        changeBulkUploadFile,
        uploadBulkUsers,
        clearBulkUploadResult,
        bulkUploadCompleted,

        closeMessage,
    };
};