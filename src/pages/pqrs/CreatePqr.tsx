import { useState } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { createPqr } from "../../services/pqrService";

const CreatePqr = () => {
    const theme = useTheme();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const style = {
        container: {
            maxWidth: "800px",
            mx: "auto",
        },

        paper: {
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
        },

        title: {
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
        },

        subtitle: {
            color: theme.palette.text.secondary,
            mb: 3,
        },

        form: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },

        button: {
            mt: 2,
            py: 1.2,
            fontWeight: 600,
            borderRadius: 2,
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await createPqr({
                title,
                description,
            });

            setMessage("PQR creada correctamente.");
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error(error);
            setError("Error al crear la PQR.");
        }
    };

    return (
        <Box sx={style.container}>
            <Paper sx={style.paper}>
                <Typography variant="h5" sx={style.title}>
                    Crear nueva PQR
                </Typography>

                <Typography variant="body2" sx={style.subtitle}>
                    Registra una petición, queja, reclamo o solicitud para que sea
                    atendida por el administrador.
                </Typography>

                {message && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" sx={style.form} onSubmit={handleSubmit}>
                    <TextField
                        label="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        required
                        multiline
                        minRows={5}
                    />

                    <Button type="submit" variant="contained" sx={style.button}>
                        Crear PQR
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreatePqr;