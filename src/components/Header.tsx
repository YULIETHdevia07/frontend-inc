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
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

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
        navigate("/");
    };

    const style = {
        appBar: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
        },

        toolbar: {
            minHeight: "72px",
            display: "flex",
            justifyContent: "space-between",
            px: 3,
        },

        leftContent: {
            display: "flex",
            alignItems: "center",
            gap: 2,
        },

        menuButton: {
            width: 44,
            height: 44,
            borderRadius: "14px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
            transition: "all 0.25s ease",

            "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "scale(1.05)",
            },
        },

        titleBox: {
            display: "flex",
            flexDirection: "column",
        },

        title: {
            fontWeight: 900,
            lineHeight: 1.1,
        },

        subtitle: {
            fontSize: "0.78rem",
            color: theme.palette.text.secondary,
            fontWeight: 500,
        },

        rightContent: {
            display: "flex",
            alignItems: "center",
            gap: 2,
        },

        userBox: {
            display: {
                xs: "none",
                sm: "flex",
            },
            flexDirection: "column",
            alignItems: "flex-end",
        },

        userName: {
            fontSize: "0.9rem",
            fontWeight: 800,
            color: theme.palette.text.primary,
        },

        userRole: {
            fontSize: "0.75rem",
            color: theme.palette.text.secondary,
        },

        avatar: {
            width: 42,
            height: 42,
            backgroundColor: `${theme.palette.primary.main}22`,
            color: theme.palette.primary.main,
            fontWeight: 900,
            border: `2px solid ${theme.palette.primary.main}30`,
        },

        logoutButton: {
            borderRadius: "14px",
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 800,
            backgroundColor: `${theme.palette.error.main}12`,
            color: theme.palette.error.main,

            "&:hover": {
                backgroundColor: `${theme.palette.error.main}22`,
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
                </Box>

                <Box sx={style.rightContent}>
                    <Box sx={style.userBox}>
                        <Typography sx={style.userName}>
                            {user ? `Hola, ${user.name}` : "Usuario"}
                        </Typography>

                        <Typography sx={style.userRole}>
                            Bienvenido nuevamente
                        </Typography>
                    </Box>


                    <Avatar sx={style.avatar}>
                        {user ? userInitial : <PersonIcon />}
                    </Avatar>

                    <Button
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={style.logoutButton}
                    >
                        Cerrar sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;