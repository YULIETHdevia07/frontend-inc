import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../hooks/auth/useLogin";
import { appBrand } from "../data/appBrand";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    email,
    password,
    loading,

    error,
    formErrors,

    handleEmailChange,
    handlePasswordChange,
    handleLogin,
  } = useLogin();

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

    logo: {
      width: "160px",
      height: "auto",
      objectFit: "contain",
      marginBottom: "0.5rem",
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

  return (
    <Box sx={style.container}>
      <Box component="form" onSubmit={handleLogin} sx={style.form} noValidate>
        <Box
          component="img"
          src={appBrand.logo}
          alt={appBrand.logoAlt}
          sx={style.logo}
        />

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          Bienvenido a tu plataforma de gestión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Correo electrónico"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          sx={style.input}
          fullWidth
          required
          disabled={loading}
          error={!!formErrors.email}
          helperText={formErrors.email}
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(event) => handlePasswordChange(event.target.value)}
          sx={style.input}
          fullWidth
          required
          disabled={loading}
          error={!!formErrors.password}
          helperText={formErrors.password}
        />

        <Button
          type="submit"
          variant="contained"
          sx={style.button}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Iniciar sesión"
          )}
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
            onClick={() => {
              if (!loading) navigate("/register");
            }}
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