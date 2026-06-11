import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1f2a7a",   // Azul oscuro del logo, menos morado
      light: "#e6e9ff",  // Azul claro suave
      dark: "#141a4d",   // Azul más oscuro para hover
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#f2d31b",   // Amarillo del logo
      light: "#fff7b0",
      dark: "#c6a900",
      contrastText: "#141a4d",
    },

    background: {
      default: "#f7f8ff",
      paper: "#ffffff",
    },

    text: {
      primary: "#141a4d",
      secondary: "#5f6478",
    },

    error: {
      main: "#d32f2f",
    },

    success: {
      main: "#2e7d32",
    },

    warning: {
      main: "#ecca09",
    },

    info: {
      main:  "#0d47a1",
    },

    divider: "#dfe3f5",
  },

  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});