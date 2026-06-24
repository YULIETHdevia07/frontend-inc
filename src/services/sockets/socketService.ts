import { io, type Socket } from "socket.io-client";
import type { PqrMessage, PqrUnreadCountUpdatedData } from "../../interfaces/pqrs/pqr.interface";
import type { Notification } from "../../interfaces/notifications/notification.interface";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

// Evita conexiones duplicadas
let socket: Socket | null = null;

// Crea o retorna la conexión activa con Socket.IO
export const connectSocket = (token: string): Socket => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(SOCKET_URL, {
        auth: {
            token,
        },
    });

    return socket;
};

// Retorna la instancia actual del socket
export const getSocket = (): Socket | null => {
    return socket;
};

// Une al usuario autenticado a la sala de una PQR
export const joinPqrRoom = (pqrId: number): void => {
    socket?.emit("join_pqr", {
        pqrId,
    });
};

// Envía un mensaje dentro del chat de una PQR
export const sendPqrMessage = (pqrId: number, content: string): void => {
    socket?.emit("send_pqr_message", {
        pqrId,
        content,
    });
};

// Escucha cuando el backend confirma que el usuario entró a la sala de una PQR
export const listenJoinedPqrRoom = (
    callback: (data: { message: string; pqrId: number }) => void
): void => {
    socket?.on("joined_pqr", callback);
};

// Escucha cuando llega un nuevo mensaje del chat de PQR
export const listenNewPqrMessage = (
    callback: (message: PqrMessage) => void
): void => {
    socket?.on("new_pqr_message", callback);
};

// Escucha cuando se actualiza el contador de mensajes no revisados de una PQR.
export const listenPqrUnreadCountUpdated = (
    callback: (data: PqrUnreadCountUpdatedData) => void
): void => {
    socket?.on("pqr_unread_count_updated", callback);
};

// Escucha cuando llega una nueva notificación en tiempo real
export const listenNewNotification = (
    callback: (notification: Notification) => void
): void => {
    socket?.on("new_notification", callback);
};

// Escucha errores enviados por el backend
export const listenSocketError = (
    callback: (error: { message: string }) => void
): void => {
    socket?.on("socket_error", callback);
};

// Limpia los listeners del chat para evitar duplicados
export const removePqrSocketListeners = (): void => {
    socket?.off("new_pqr_message");
    socket?.off("socket_error");
    socket?.off("joined_pqr");
};

// Limpia el listener de notificaciones para evitar duplicados
export const removeNotificationSocketListeners = (): void => {
    socket?.off("new_notification");
};

// Desconecta el socket cuando el usuario cierra sesión
export const disconnectSocket = (): void => {
    socket?.disconnect();
    socket = null;
};