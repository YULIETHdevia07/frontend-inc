import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useCreatePqr } from "../../hooks/useCreatePqr";
import { pqrCaseTypes } from "../../data/pqrCaseTypes";

import ClearableSelect from "../../components/common/ClearableSelect";

// Página donde el usuario crea una nueva PQR.
const CreatePqr = () => {
    const theme = useTheme();

    const {
        caseType,
        description,

        message,
        error,
        formErrors,

        handleCaseTypeChange,
        handleDescriptionChange,
        handleCreatePqr,
    } = useCreatePqr();

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

    return (
        <Box sx={style.container}>
            <Paper sx={style.paper}>
                <Typography variant="h5" sx={style.title}>
                    Crear nueva PQR
                </Typography>

                <Typography variant="body2" sx={style.subtitle}>
                    Registra una petición, queja, reclamo o solicitud para que sea
                    atendida.
                </Typography>

                {/* Mensaje cuando la PQR se crea correctamente. */}
                {message && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                )}

                {/* Mensaje para errores generales del backend. */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Formulario de creación de PQR. */}
                <Box component="form" sx={style.form} onSubmit={handleCreatePqr}>
                    <ClearableSelect
                        label="Tipo de caso"
                        value={caseType}
                        required
                        clearable
                        options={pqrCaseTypes}
                        error={formErrors.caseType}
                        onChange={handleCaseTypeChange}
                    />

                    <TextField
                        label="Descripción"
                        required
                        placeholder="Describe tu solicitud, queja o reclamo"
                        value={description}
                        onChange={(event) =>
                            handleDescriptionChange(event.target.value)
                        }
                        fullWidth
                        multiline
                        minRows={4}
                        slotProps={{
                            htmlInput: {
                                maxLength: 500,
                            },
                        }}
                        error={!!formErrors.description}
                        helperText={
                            formErrors.description
                                ? formErrors.description
                                : `${description.length}/500`
                        }
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