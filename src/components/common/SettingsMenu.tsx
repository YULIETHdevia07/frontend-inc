import { useState } from "react";

import {
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

// Menú de configuración del header.
const SettingsMenu = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    // Abre el menú de configuración.
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Cierra el menú de configuración.
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Navega a la página de firma del usuario.
    const goToMySignature = () => {
        handleCloseMenu();
        navigate("/my-signature");
    };

    const style = {
        settingsButton: {
            width: 40,
            height: 40,
            borderRadius: 10,
            color: theme.palette.text.secondary,
            border: "1px solid transparent",
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
            },
            "&:focus": {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                color: theme.palette.primary.main,
            },
        },

        activeSettingsButton: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
            color: theme.palette.primary.main,
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.18),
            },
            "&:focus": {
                backgroundColor: alpha(theme.palette.primary.main, 0.18),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.45)}`,
            },
        },

        menuPaper: {
            width: 260,
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
            borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.45)}`,
        },

        title: {
            fontSize: "0.88rem",
            fontWeight: 900,
            color: theme.palette.text.primary,
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

        menuContent: {
            py: 1,
            backgroundColor: theme.palette.background.default,
        },

        menuItem: {
            mx: 1,
            px: 1.2,
            py: 1.1,
            borderRadius: 2.5,
            color: theme.palette.text.primary,
            transition: "all 0.18s ease",
            "&:hover": {
                 border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
            },
        },

        menuIcon: {
            color: theme.palette.primary.main,
            minWidth: 34,
        },

        menuText: {
            "& .MuiListItemText-primary": {
                fontSize: "0.82rem",
                fontWeight: 800,
            },
        },
    };

    return (
        <>
            <Tooltip title="Configuración">
                <IconButton
                    onClick={handleOpenMenu}
                    sx={open ? style.activeSettingsButton : style.settingsButton}
                >
                    <SettingsOutlinedIcon />
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
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Box sx={style.header}>
                    <Typography component="p" sx={style.title}>
                        Configuración
                    </Typography>

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

                <Box sx={style.menuContent}>
                    <MenuItem onClick={goToMySignature} sx={style.menuItem}>
                        <ListItemIcon sx={style.menuIcon}>
                            <DrawOutlinedIcon fontSize="small" />
                        </ListItemIcon>

                        <ListItemText
                            primary="Mi firma"
                            sx={style.menuText}
                        />
                    </MenuItem>
                </Box>
            </Menu>
        </>
    );
};

export default SettingsMenu;