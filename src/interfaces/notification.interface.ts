// Tipos de notificaciones permitidas en el sistema.
export type NotificationType =
    | "NEW_PQR"
    | "STATUS_CHANGE"
    | "PQR_CLOSED"
    | "PQR_RATED"
    | "PQR_TAKEN";

// Estructura principal de una notificación.
export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    userId: number;
    pqrId: number | null;
    createdAt: string;
}

// Respuesta al obtener las notificaciones del usuario autenticado.
export interface NotificationsResponse {
    message: string;
    notifications: Notification[];
}

// Respuesta al obtener la cantidad de notificaciones no leídas.
export interface UnreadNotificationsCountResponse {
    message: string;
    count: number;
}

// Respuesta al marcar todas las notificaciones como leídas.
export interface MarkAllNotificationsAsReadResponse {
    message: string;
    updatedCount: number;
}

// Respuesta al marcar una notificación como leída.
export interface MarkNotificationAsReadResponse {
    message: string;
}