import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
    Badge,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    Tooltip,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { formatDate } from "../../utils/dateUtils";

// Muestra la campana de notificaciones en el Header
const NotificationBell = () => {
    const {
        notifications,
        unreadCount,
        loading,
        handleMarkAsRead,
        handleMarkAllAsRead,
    } = useNotifications();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    // Abre el menú de notificaciones
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Cierra el menú de notificaciones
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Notificaciones">
                <IconButton onClick={handleOpenMenu}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsNoneOutlinedIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                slotProps={{
                    paper: {
                        sx: {
                            width: 360,
                            maxHeight: 420,
                            borderRadius: 3,
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography component="p" sx={{ fontWeight: 700 }}>
                            Notificaciones
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {unreadCount} sin leer
                        </Typography>
                    </Box>

                    <Tooltip title="Marcar todas como leídas">
                        <span>
                            <IconButton
                                size="small"
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                <DoneAllOutlinedIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>

                <Divider />

                {loading ? (
                    <Box
                        sx={{
                            py: 4,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress size={28} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography component="p" sx={{ fontWeight: 600 }}>
                            No tienes notificaciones
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Aquí aparecerán las novedades importantes de tus PQR.
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {notifications.map((notification) => (
                            <ListItemButton
                                key={notification.id}
                                onClick={() => handleMarkAsRead(notification.id)}
                                sx={{
                                    alignItems: "flex-start",
                                    px: 2,
                                    py: 1.5,
                                    bgcolor: notification.isRead
                                        ? "background.paper"
                                        : "primary.light",
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            component="p"
                                            sx={{
                                                fontWeight: notification.isRead ? 500 : 700,
                                            }}
                                        >
                                            {notification.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box component="span">
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: "block",
                                                    mt: 0.5,
                                                }}
                                            >
                                                {notification.message}
                                            </Typography>

                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: "block",
                                                    mt: 0.5,
                                                }}
                                            >
                                                {formatDate(notification.createdAt)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;