import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const style = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.background.default})`,
    },
    form: {
      width: "420px",
      minHeight: "480px",
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
    alert: {
      width: "100%",
      borderRadius: "10px",
      fontSize: "0.9rem",
      alignItems: "center",
    },
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Ingresa un correo electrónico válido.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    try {
      await api.post("/users/register", {
        name,
        email,
        password,
      });

      setSuccessMessage("Usuario registrado correctamente.");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
        "Error al registrar usuario."
      );
    }
  };

  return (
    <Box sx={style.container}>
      <Box component="form" onSubmit={handleRegister} sx={style.form}>
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Crear cuenta
        </Typography>

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          Regístrate para acceder a App-INC
        </Typography>

        <TextField
          label="Nombre completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={style.input}
          fullWidth
          required
        />

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
          <Alert severity="error" sx={style.alert}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={style.alert}>
            {successMessage}
          </Alert>
        )}

        <Button type="submit" variant="contained" sx={style.button}>
          Registrarse
        </Button>

        <Typography
          sx={{
            fontSize: "0.9rem",
            color: theme.palette.text.secondary,
          }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link sx={style.link} onClick={() => navigate("/")}>
            Inicia sesión
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;