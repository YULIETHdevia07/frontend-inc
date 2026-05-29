import { io, type Socket } from "socket.io-client";
import type { PqrMessage } from "../interfaces/pqr.interface";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Evita conexiones duplicadas
let socket: Socket | null = null;

// Crea o retorna la conexión activa con Socket.IO.
export const connectPqrSocket = (token: string): Socket => {
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

// Retorna la instancia actual del socket.
export const getPqrSocket = (): Socket | null => {
    return socket;
};

// Une al usuario autenticado a la sala de una PQR.
export const joinPqrRoom = (pqrId: number): void => {
    socket?.emit("join_pqr", {
        pqrId,
    });
};

// Envía un mensaje dentro del chat de una PQR.
export const sendPqrMessage = (pqrId: number, content: string): void => {
    socket?.emit("send_pqr_message", {
        pqrId,
        content,
    });
};

// Escucha cuando el backend confirma que el usuario entró a la sala de una PQR.
export const listenJoinedPqrRoom = (
    callback: (data: { message: string; pqrId: number }) => void
): void => {
    socket?.on("joined_pqr", callback);
};

// Escucha cuando llega un nuevo mensaje.
export const listenNewPqrMessage = (
    callback: (message: PqrMessage) => void
): void => {
    socket?.on("new_pqr_message", callback);
};

// Escucha errores enviados por el backend.
export const listenPqrSocketError = (
    callback: (error: { message: string }) => void
): void => {
    socket?.on("socket_error", callback);
};

// Limpia los listeners del chat para evitar duplicados.
export const removePqrSocketListeners = (): void => {
    socket?.off("new_pqr_message");
    socket?.off("socket_error");
    socket?.off("joined_pqr");
};

// Desconecta el socket cuando sea necesario.
export const disconnectPqrSocket = (): void => {
    socket?.disconnect();
    socket = null;
};