import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#044D9E",   // Azul principal del logo
      light: "#E6F0FF",  // Azul claro suave para fondos
      dark: "#073F84",   // Azul oscuro para hover
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#1AAD46",   // Verde principal del logo
      light: "#DFF8E8",  // Verde claro suave
      dark: "#0C9E40",   // Verde oscuro para hover
      contrastText: "#ffffff",
    },

    background: {
      default: "#F5F9FF", // Fondo general claro con tono azul
      paper: "#ffffff",
    },

    text: {
      primary: "#073F84",   // Azul oscuro del logo
      secondary: "#5F6478",
    },

    error: {
      main: "#D32F2F",
    },

    success: {
      main: "#1AAD46", // Verde del logo
    },

    warning: {
      main: "#F2C94C", // Amarillo suave solo para alertas
    },

    info: {
      main: "#116CC2", // Azul medio del logo
    },

    divider: "#DDE8F7",
  },

  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});