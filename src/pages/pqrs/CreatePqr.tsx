import { useState } from "react";
import { ValidationError } from "yup";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { createPqr } from "../../services/pqrService";
import { createPqrSchema } from "../../validations/pqrValidation";

const CreatePqr = () => {
    const theme = useTheme();

    const pqrCaseTypes = [
        {
            label: "SAP",
            value: "SAP",
        },
        {
            label: "Daño de equipo",
            value: "DANO_EQUIPO",
        },
        {
            label: "Instalación",
            value: "INSTALACION",
        },
        {
            label: "Otro",
            value: "OTRO",
        },
    ];

    const [caseType, setCaseType] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({
        caseType: "",
        description: "",
    });

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
        iconSelect: {
            position: "absolute",
            right: 32,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            color: theme.palette.text.secondary,
        }
    };

    const handleCreatePqr = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            caseType,
            description,
        };

        try {
            await createPqrSchema.validate(formData, {
                abortEarly: false,
            });

            setFormErrors({
                caseType: "",
                description: "",
            });

            setError("");
            setMessage("");

            await createPqr({
                caseType: caseType.trim(),
                description: description.trim(),
            });

            setCaseType("");
            setDescription("");

            setMessage("PQR creada correctamente.");
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors = {
                    caseType: "",
                    description: "",
                };

                error.inner.forEach((validationError) => {
                    const path = validationError.path as keyof typeof errors;

                    if (path) {
                        errors[path] = validationError.message;
                    }
                });

                setFormErrors(errors);
                setMessage("");
                return;
            }

            console.error(error);
            setError("Error al crear la PQR.");
            setMessage("");
        }
    };

    const handleInputChange = (
        field: "caseType" | "description",
        value: string
    ) => {
        if (field === "caseType") {
            setCaseType(value);
        }

        if (field === "description") {
            setDescription(value);
        }

        setMessage("");
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
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


                <Box component="form" sx={style.form} onSubmit={handleCreatePqr}>
                    <FormControl fullWidth required error={!!formErrors.caseType}>
                        <InputLabel>Tipo de caso</InputLabel>

                        <Select
                            label="Tipo de caso"
                            value={caseType}
                            required
                            onChange={(e) => handleInputChange("caseType", e.target.value)}
                        >

                            {pqrCaseTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {caseType && (
                            <IconButton
                                size="small"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleInputChange("caseType", "")}
                                sx={style.iconSelect}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}

                        {formErrors.caseType && (
                            <FormHelperText>{formErrors.caseType}</FormHelperText>
                        )}
                    </FormControl>

                    <TextField
                        label="Descripción"
                        required
                        placeholder="Describe tu solicitud, queja o reclamo"
                        value={description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
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