import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import {
    Badge,
    Box,
    CircularProgress,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";

import { useNotifications } from "../../hooks/notifications/useNotifications";
import { formatDate } from "../../utils/common/dateUtils";

type NotificationCategory = "ALL" | "UNREAD";

// Muestra la campana de notificaciones en el Header.
const NotificationBell = () => {
    const theme = useTheme();

    const {
        notifications,
        unreadCount,
        loading,
        handleMarkAsRead,
        handleMarkAllAsRead,
    } = useNotifications();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Controla la categoría activa del menú.
    const [activeCategory, setActiveCategory] =
        useState<NotificationCategory>("ALL");

    const open = Boolean(anchorEl);

    // Abre el menú de notificaciones.
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Cierra el menú de notificaciones.
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Cambia entre todas y no leídas.
    const handleCategoryChange = (
        _event: React.SyntheticEvent,
        value: NotificationCategory
    ) => {
        setActiveCategory(value);
    };

    // Filtra las notificaciones según la categoría seleccionada.
    const filteredNotifications = useMemo(() => {
        if (activeCategory === "UNREAD") {
            return notifications.filter((notification) => !notification.isRead);
        }

        return notifications;
    }, [activeCategory, notifications]);

    const totalCount = notifications.length;

    const unreadOnlyCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const style = {
        bellButton: {
            width: 40,
            height: 40,
            borderRadius: 10,
            color: theme.palette.text.secondary,
            border: "1px solid transparent",
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
            },
        },

        activeBellButton: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
            color: theme.palette.primary.main,
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.18),
            },
        },

        menuPaper: {
            width: {
                xs: 330,
                sm: 380,
            },
            height: 430,
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.primary.light, 0.55)}`,
            boxShadow: "0 16px 38px rgba(15, 23, 42, 0.10)",
        },

        header: {
            height: 46,
            px: 1.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.palette.background.paper,
        },

        title: {
            fontSize: "0.88rem",
            fontWeight: 900,
            color: theme.palette.text.primary,
        },

        headerActions: {
            display: "flex",
            alignItems: "center",
            gap: 0.3,
        },

        smallIconButton: {
            width: 30,
            height: 30,
            borderRadius: 2,
            color: theme.palette.text.secondary,
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
            },
        },

        markAllButton: {
            width: 30,
            height: 30,
            borderRadius: 2,
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.14),
            },
            "&.Mui-disabled": {
                backgroundColor: alpha(theme.palette.text.disabled, 0.08),
                color: theme.palette.text.disabled,
            },
        },

        tabsWrapper: {
            px: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.primary.light, 0.45)}`,
            borderBottom: `1px solid ${alpha(
                theme.palette.primary.light,
                0.45
            )}`,
            backgroundColor: theme.palette.background.paper,
        },

        tabs: {
            minHeight: 36,
            "& .MuiTabs-indicator": {
                height: 2,
                borderRadius: 999,
            },
        },

        tab: {
            minHeight: 36,
            minWidth: "auto",
            px: 1,
            py: 0,
            mr: 1,
            textTransform: "none",
            fontSize: "0.76rem",
            fontWeight: 800,
            color: theme.palette.text.secondary,
        },

        content: {
            height: 348,
            backgroundColor: theme.palette.background.default,
        },

        loadingBox: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },

        emptyBox: {
            height: "100%",
            px: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        },

        emptyIconBox: {
            mb: 1.3,
            width: 60,
            height: 60,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
        },

        emptyTitle: {
            fontSize: "0.9rem",
            fontWeight: 900,
            color: theme.palette.text.primary,
        },

        emptyDescription: {
            mt: 0.5,
            fontSize: "0.78rem",
            color: theme.palette.text.secondary,
            lineHeight: 1.45,
        },

        list: {
            height: "100%",
            overflowY: "auto",
            px: 1.2,
            py: 1.2,
        },

        item: {
            mb: 1,
            px: 1.2,
            py: 1.1,
            borderRadius: 3,
            alignItems: "flex-start",
            border: `1px solid ${alpha(theme.palette.primary.light, 0.55)}`,
            backgroundColor: theme.palette.background.paper,
            transition: "all 0.18s ease",
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.light, 0.28),
                borderColor: alpha(theme.palette.primary.main, 0.18),
            },
        },

        unreadItem: {
            borderColor: alpha(theme.palette.primary.main, 0.18),
            backgroundColor: alpha(theme.palette.primary.light, 0.45),
        },

        readItem: {
            backgroundColor: theme.palette.background.paper,
        },

        unreadDot: {
            mt: 0.5,
            mr: 0.8,
            fontSize: 8,
            color: theme.palette.primary.main,
            flexShrink: 0,
        },

        readDotSpace: {
            width: 16,
            flexShrink: 0,
        },

        itemTitle: {
            fontSize: "0.8rem",
            lineHeight: 1.3,
            color: theme.palette.text.primary,
        },

        itemMessage: {
            display: "block",
            mt: 0.45,
            fontSize: "0.75rem",
            lineHeight: 1.4,
            color: theme.palette.text.secondary,
        },

        itemDate: {
            display: "block",
            mt: 0.65,
            textAlign: "right",
            fontSize: "0.68rem",
            color: theme.palette.text.disabled,
            fontWeight: 600,
        },
    };

    return (
        <>
            <Tooltip title="Notificaciones">
                <IconButton
                    onClick={handleOpenMenu}
                    sx={open ? style.activeBellButton : style.bellButton}
                >
                    <Badge
                        badgeContent={unreadCount}
                        color="error"
                        max={99}
                        overlap="circular"
                    >
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
                        sx: style.menuPaper,
                    },
                }}
            >
                <Box sx={style.header}>
                    <Typography component="p" sx={style.title}>
                        Notificaciones
                    </Typography>

                    <Box sx={style.headerActions}>
                        <Tooltip title="Marcar todas como leídas">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={handleMarkAllAsRead}
                                    disabled={unreadCount === 0}
                                    sx={style.markAllButton}
                                >
                                    <DoneAllOutlinedIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Tooltip title="Cerrar">
                            <IconButton
                                size="small"
                                onClick={handleCloseMenu}
                                sx={style.smallIconButton}
                            >
                                <CloseOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box sx={style.tabsWrapper}>
                    <Tabs
                        value={activeCategory}
                        onChange={handleCategoryChange}
                        sx={style.tabs}
                    >
                        <Tab
                            value="ALL"
                            label={`Todos (${totalCount})`}
                            sx={style.tab}
                        />

                        <Tab
                            value="UNREAD"
                            label={`No leídas (${unreadOnlyCount})`}
                            sx={style.tab}
                        />
                    </Tabs>
                </Box>

                <Box sx={style.content}>
                    {loading ? (
                        <Box sx={style.loadingBox}>
                            <CircularProgress size={26} />
                        </Box>
                    ) : filteredNotifications.length === 0 ? (
                        <Box sx={style.emptyBox}>
                            <Box sx={style.emptyIconBox}>
                                <NotificationsOffOutlinedIcon fontSize="large" />
                            </Box>

                            <Typography component="p" sx={style.emptyTitle}>
                                {activeCategory === "UNREAD"
                                    ? "No tienes notificaciones pendientes"
                                    : "No tienes notificaciones"}
                            </Typography>

                            <Typography sx={style.emptyDescription}>
                                {activeCategory === "UNREAD"
                                    ? "Todas tus notificaciones ya fueron leídas."
                                    : "Aquí encontrarás todas tus notificaciones."}
                            </Typography>
                        </Box>
                    ) : (
                        <List disablePadding sx={style.list}>
                            {filteredNotifications.map((notification) => {
                                const isUnread = !notification.isRead;

                                return (
                                    <ListItemButton
                                        key={notification.id}
                                        onClick={() =>
                                            handleMarkAsRead(notification.id)
                                        }
                                        sx={{
                                            ...style.item,
                                            ...(isUnread
                                                ? style.unreadItem
                                                : style.readItem),
                                        }}
                                    >
                                        {isUnread ? (
                                            <FiberManualRecordIcon
                                                sx={style.unreadDot}
                                            />
                                        ) : (
                                            <Box sx={style.readDotSpace} />
                                        )}

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="p"
                                                    sx={{
                                                        ...style.itemTitle,
                                                        fontWeight: isUnread
                                                            ? 900
                                                            : 600,
                                                    }}
                                                >
                                                    {notification.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box component="span">
                                                    <Typography
                                                        component="span"
                                                        sx={style.itemMessage}
                                                    >
                                                        {notification.message}
                                                    </Typography>

                                                    <Typography
                                                        component="span"
                                                        sx={style.itemDate}
                                                    >
                                                        {formatDate(
                                                            notification.createdAt
                                                        )}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    )}
                </Box>
            </Menu>
        </>
    );
};

export default NotificationBell;