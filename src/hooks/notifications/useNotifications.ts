import { useCallback, useEffect, useState } from "react";
import type { Notification } from "../../interfaces/notifications/notification.interface";
import {
    getNotifications,
    getUnreadNotificationsCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../services/notifications/notificationService";
import {
    listenNewNotification,
    removeNotificationSocketListeners,
} from "../../services/sockets/socketService";

// Maneja la lógica de las notificaciones del usuario autenticado
export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Carga las notificaciones del usuario
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getNotifications();

            setNotifications(response.notifications);
        } catch (error) {
            console.error("Error al cargar las notificaciones:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Carga la cantidad de notificaciones no leídas
    const loadUnreadCount = useCallback(async () => {
        try {
            const response = await getUnreadNotificationsCount();

            setUnreadCount(response.count);
        } catch (error) {
            console.error("Error al cargar el contador de notificaciones:", error);
        }
    }, []);

    // Marca una notificación como leída
    const handleMarkAsRead = async (notificationId: number) => {
        const notification = notifications.find(
            (item) => item.id === notificationId
        );

        try {
            await markNotificationAsRead(notificationId);

            setNotifications((prevNotifications) =>
                prevNotifications.map((item) =>
                    item.id === notificationId
                        ? { ...item, isRead: true }
                        : item
                )
            );

            if (notification && !notification.isRead) {
                setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
            }
        } catch (error) {
            console.error("Error al marcar la notificación como leída:", error);
        }
    };

    // Marca todas las notificaciones como leídas
    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error("Error al marcar todas las notificaciones como leídas:", error);
        }
    };

    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, [loadNotifications, loadUnreadCount]);

    useEffect(() => {
        // Escucha nuevas notificaciones enviadas por Socket.IO
        listenNewNotification((notification) => {
            setNotifications((prevNotifications) => [
                notification,
                ...prevNotifications,
            ]);

            if (!notification.isRead) {
                setUnreadCount((prevCount) => prevCount + 1);
            }
        });

        // Limpia el listener para evitar notificaciones duplicadas
        return () => {
            removeNotificationSocketListeners();
        };
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        loadUnreadCount,
        handleMarkAsRead,
        handleMarkAllAsRead,
    };
};