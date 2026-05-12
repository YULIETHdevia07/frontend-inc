import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      cursor: "pointer",
      textDecoration: "none",
      color: theme.palette.primary.main,
      fontWeight: 500,
    },
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/users/register", {
        name,
        email,
        password,
      });

      alert("Usuario registrado correctamente");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error al registrar usuario");
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
        />

        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={style.input}
          fullWidth
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={style.input}
          fullWidth
        />

        <Button type="submit" variant="contained" sx={style.button}>
          Registrarse
        </Button>

        <Link sx={style.link} onClick={() => navigate("/")}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </Box>
    </Box>
  );
};

export default Register;