import api from "../../api/axios";
import type {
    MarkAllNotificationsAsReadResponse,
    MarkNotificationAsReadResponse,
    NotificationsResponse,
    UnreadNotificationsCountResponse,
} from "../../interfaces/notifications/notification.interface";

// Obtiene las notificaciones del usuario autenticado
export const getNotifications = async () => {
    const { data } = await api.get<NotificationsResponse>("/notifications");

    return data;
};

// Obtiene la cantidad de notificaciones no leídas
export const getUnreadNotificationsCount = async () => {
    const { data } = await api.get<UnreadNotificationsCountResponse>(
        "/notifications/unread-count"
    );

    return data;
};

// Marca una notificación como leída
export const markNotificationAsRead = async (notificationId: number) => {
    const { data } = await api.patch<MarkNotificationAsReadResponse>(
        `/notifications/${notificationId}/read`
    );

    return data;
};

// Marca todas las notificaciones como leídas
export const markAllNotificationsAsRead = async () => {
    const { data } = await api.patch<MarkAllNotificationsAsReadResponse>(
        "/notifications/read-all"
    );

    return data;
};