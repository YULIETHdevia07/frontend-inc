import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const style = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      background: `linear-gradient(
      135deg,
      ${theme.palette.primary.light},
      ${theme.palette.background.default}
    )`,
    },

    form: {
      width: "420px",
      minHeight: "430px",

      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      backgroundColor: theme.palette.background.paper,

      padding: "2rem",
      borderRadius: "12px",
      gap: "16px",

      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
    },

    input: {
      width: "100%",
    },

    button: {
      width: "100%",
      height: "45px",

      textTransform: "none",

      backgroundColor: theme.palette.primary.main,

      fontWeight: 600,

      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },

    link: {
      marginTop: "0.5rem",

      cursor: "pointer",

      textDecoration: "none",

      color: theme.palette.primary.main,

      fontWeight: 500,
    },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      const token = response.data.token;

      await login(token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        "Correo o contraseña incorrectos."
      );
    }
  };

  return (
    <Box sx={style.container}>
      <Box component="form" onSubmit={handleLogin} sx={style.form}>
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          App
        </Typography>

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          Bienvenido a tu plataforma de gestión
        </Typography>

        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={style.input}
          fullWidth
          required
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={style.input}
          fullWidth
          required
        />

        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              borderRadius: "10px",
              fontSize: "0.9rem",
              alignItems: "center",
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <Button type="submit" variant="contained" sx={style.button}>
          Iniciar sesión
        </Button>

        <Link sx={style.link}>¿Olvidaste tu contraseña?</Link>

        <Typography
          sx={{
            fontSize: "0.9rem",
            color: theme.palette.text.secondary,
          }}
        >
          ¿No tienes una cuenta?{" "}
          <Link
            onClick={() => navigate("/register")}
            sx={style.link}
          >
            Regístrate aquí
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;