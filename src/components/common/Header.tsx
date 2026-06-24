import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Avatar,
    Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationBell from "./NotificationBell";
import { getUserRoleLabel } from "../../utils/users/userRoleUtils";
import { appBrand } from "../../data/appBrand";

interface HeaderProps {
    openSidebar: boolean;
    setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ openSidebar, setOpenSidebar }: HeaderProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/dashboard");
    };

    const style = {
        appBar: {
            backgroundColor: theme.palette.background.paper,
            // backgroundColor: "red",
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
        },

        toolbar: {
            minHeight: "72px",
            display: "flex",
            justifyContent: "space-between",
            px: {
                xs: 1.5,
                sm: 2,
                md: 3,
            },
            gap: 2,
        },

        leftContent: {
            display: "flex",
            alignItems: "center",
            gap: {
                xs: 1,
                sm: 2,
            },
            minWidth: 0,
        },

        menuButton: {
            width: {
                xs: 40,
                sm: 44,
            },
            height: {
                xs: 40,
                sm: 44,
            },
            borderRadius: "14px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
            transition: "all 0.25s ease",
            flexShrink: 0,

            "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "scale(1.05)",
            },
        },

        brandBox: {
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            minWidth: 0,
        },

        logo: {
            display: {
                xs: "none",
                sm: "block",
            },
            width: {
                sm: 120,
                md: 145,
            },
            height: "auto",
            objectFit: "contain",
        },

        logoIcon: {
            display: {
                xs: "block",
                sm: "none",
            },
            width: 42,
            height: 42,
            objectFit: "contain",
        },

        titleBox: {
            display: {
                xs: "none",
                md: "flex",
            },
            flexDirection: "column",
            alignItems: "flex-end",
        },

        title: {
            fontSize: "0.9rem",
            fontWeight: 800,
            color: theme.palette.text.primary,
            maxWidth: 220,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            lineHeight: 1.1,
        },

        subtitle: {
            fontSize: "0.75rem",
            color: theme.palette.text.secondary,
            fontWeight: 500,
        },

        rightContent: {
            display: "flex",
            alignItems: "center",
            gap: {
                xs: 1,
                sm: 1.5,
                md: 2,
            },
            flexShrink: 0,
        },

        avatar: {
            width: {
                xs: 38,
                sm: 42,
            },
            height: {
                xs: 38,
                sm: 42,
            },
            backgroundColor: `${theme.palette.primary.main}22`,
            color: theme.palette.primary.main,
            fontWeight: 900,
            border: `2px solid ${theme.palette.primary.main}30`,
        },

        logoutButton: {
            borderRadius: "14px",
            px: {
                xs: 1,
                sm: 2,
            },
            py: 1,
            minWidth: {
                xs: 44,
                sm: "auto",
            },
            textTransform: "none",
            fontWeight: 800,
            backgroundColor: `${theme.palette.error.main}12`,
            color: theme.palette.error.main,

            "& .MuiButton-startIcon": {
                mr: {
                    xs: 0,
                    sm: 1,
                },
                ml: {
                    xs: 0,
                    sm: -0.5,
                },
            },

            "&:hover": {
                backgroundColor: `${theme.palette.error.main}22`,
            },
        },

        logoutText: {
            display: {
                xs: "none",
                sm: "inline",
            },
        },
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <AppBar position="static" elevation={0} sx={style.appBar}>
            <Toolbar sx={style.toolbar}>
                <Box sx={style.leftContent}>
                    <Tooltip title={openSidebar ? "Cerrar menú" : "Abrir menú"} arrow>
                        <IconButton
                            onClick={() => setOpenSidebar((prev) => !prev)}
                            sx={style.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

                    <Box sx={style.brandBox}>
                        <Box
                            component="img"
                            src={appBrand.logo}
                            alt={appBrand.logoAlt}
                            sx={style.logo}
                        />

                        <Box
                            component="img"
                            src={appBrand.logoIcon}
                            alt={appBrand.logoAlt}
                            sx={style.logoIcon}
                        />
                    </Box>
                </Box>

                <Box sx={style.rightContent}>
                    <Box sx={style.titleBox}>
                        <Typography sx={style.title}>
                            {user ? `${getUserRoleLabel(user.role)}, ${user.name}` : "Usuario"}
                        </Typography>

                        <Typography sx={style.subtitle}>
                            Bienvenido nuevamente
                        </Typography>
                    </Box>

                    <NotificationBell />

                    <Avatar sx={style.avatar}>
                        {user ? userInitial : <PersonIcon />}
                    </Avatar>

                    <Tooltip title="Cerrar sesión" arrow>
                        <Button
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={style.logoutButton}
                        >
                            <Box component="span" sx={style.logoutText}>
                                Cerrar sesión
                            </Box>
                        </Button>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;