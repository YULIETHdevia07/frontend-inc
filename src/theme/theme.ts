import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1565c0",
      light: "#e3f2fd",
      dark: "#0d47a1",
    },

    secondary: {
      main: "#7c4dff",
    },

    background: {
      default: "#f8fbff",
      paper: "#ffffff",
    },

    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },

    error: {
      main: "#d32f2f",
    },

    success: {
      main: "#2e7d32",
    },
  },

  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});