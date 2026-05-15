import { useEffect, useState } from "react";
import { ValidationError } from "yup";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Paper,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Pqr, PqrStatus } from "../../services/pqrService";
import { getAllPqrs, updatePqrStatus, respondPqr } from "../../services/pqrService";
import { responsePqrSchema } from "../../validations/pqrValidation";
import ClearableSelect from "../../components/ClearableSelect";

const AdminPqrs = () => {
    const theme = useTheme();

    const pqrStatusOptions = [
        {
            label: "PENDIENTE",
            value: "PENDIENTE",
        },
        {
            label: "EN PROCESO",
            value: "EN_PROCESO",
        },
        {
            label: "RESPONDIDA",
            value: "RESPONDIDA",
        },
        {
            label: "CERRADA",
            value: "CERRADA",
        },
    ];

    const [pqrs, setPqrs] = useState<Pqr[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [successPqrId, setSuccessPqrId] = useState<number | null>(null);
    const [statusChanges, setStatusChanges] = useState<Record<number, PqrStatus>>(
        {}
    );
    const [responseTexts, setResponseTexts] = useState<Record<number, string>>({});
    const [responseErrors, setResponseErrors] = useState<Record<number, string>>({});

    const style = {
        container: {
            width: "100%",
        },

        header: {
            mb: 3,
        },

        title: {
            fontWeight: 700,
            color: theme.palette.text.primary,
        },

        subtitle: {
            color: theme.palette.text.secondary,
            mt: 0.5,
        },

        list: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },

        card: {
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
            border: `1px solid ${theme.palette.primary.light}`,
        },

        cardHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 1,
        },

        cardTitle: {
            fontWeight: 700,
            color: theme.palette.text.primary,
        },

        description: {
            color: theme.palette.text.secondary,
            mt: 1,
            lineHeight: 1.7,
        },

        userBox: {
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary.light}`,
        },

        responseBox: {
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.light,
        },

        date: {
            mt: 1,
            color: theme.palette.text.secondary,
            fontSize: "0.85rem",
        },

        empty: {
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
        },
        actionsBox: {
            mt: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
        },

        button: {
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
        },
        responseForm: {
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },

        responseButton: {
            alignSelf: "flex-start",
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
        },
    };

    const getStatusColor = (status: PqrStatus) => {
        switch (status) {
            case "PENDIENTE":
                return "warning";

            case "EN_PROCESO":
                return "info";

            case "RESPONDIDA":
                return "success";

            case "CERRADA":
                return "default";

            default:
                return "default";
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const loadAllPqrs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllPqrs();

            setPqrs(response.pqrs);
        } catch (error) {
            console.error(error);
            setError("Error al cargar las PQR. Verifica que el usuario tenga rol ADMIN.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (pqrId: number, status: string) => {
        setStatusChanges((prev) => {
            const updated = { ...prev };

            if (!status) {
                delete updated[pqrId];
                return updated;
            }

            updated[pqrId] = status as PqrStatus;
            return updated;
        });
    };

    const handleUpdateStatus = async (pqrId: number) => {
        const newStatus = statusChanges[pqrId];
        
        if (!newStatus) {
            return;
        }

        try {
            setError("");
            setSuccessMessage("");
            setSuccessPqrId(null);

            await updatePqrStatus(pqrId, newStatus);

            setSuccessMessage("Estado actualizado correctamente.");
            setSuccessPqrId(pqrId);

            await loadAllPqrs();

            setStatusChanges((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleResponseTextChange = (pqrId: number, value: string) => {
        setResponseTexts((prev) => ({
            ...prev,
            [pqrId]: value,
        }));

        setResponseErrors((prev) => ({
            ...prev,
            [pqrId]: "",
        }));
    };

    const handleRespondPqr = async (pqrId: number) => {
        const responseText = responseTexts[pqrId] || "";

        try {
            await responsePqrSchema.validate(responseText);

            setError("");
            setSuccessMessage("");
            setSuccessPqrId(null);

            setResponseErrors((prev) => ({
                ...prev,
                [pqrId]: "",
            }));

            await respondPqr(pqrId, responseText.trim());

            setSuccessMessage("PQR respondida correctamente.");
            setSuccessPqrId(pqrId);

            await loadAllPqrs();

            setResponseTexts((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                setResponseErrors((prev) => ({
                    ...prev,
                    [pqrId]: error.message,
                }));
                return;
            }

            console.error(error);
            setResponseErrors((prev) => ({
                ...prev,
                [pqrId]: "Error al responder la PQR.",
            }));
        }
    };

    useEffect(() => {
        loadAllPqrs();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={style.container}>
            <Box sx={style.header}>
                <Typography variant="h5" sx={style.title}>
                    Todas las PQR
                </Typography>

                <Typography variant="body2" sx={style.subtitle}>
                    Administra y revisa las peticiones, quejas, reclamos o solicitudes
                    registradas por los usuarios.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {pqrs.length === 0 ? (
                <Paper sx={style.empty}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        No hay PQR registradas
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Cuando los usuarios creen PQR, aparecerán en este espacio.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={style.list}>
                    {pqrs.map((pqr) => (
                        <Paper key={pqr.id} sx={style.card}>
                            {successPqrId === pqr.id && successMessage && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {successMessage}
                                </Alert>
                            )}

                            <Box sx={style.cardHeader}>
                                <Box>
                                    <Typography variant="h6" sx={style.cardTitle}>
                                        {pqr.caseType}
                                    </Typography>

                                    <Typography variant="body2" sx={style.date}>
                                        Creada el {formatDate(pqr.createdAt)}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={pqr.status.replace("_", " ")}
                                    color={getStatusColor(pqr.status)}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>

                            <Typography variant="body2" sx={style.description}>
                                {pqr.description}
                            </Typography>

                            <Box sx={style.userBox}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Usuario solicitante
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Nombre: {pqr.user?.name || "No disponible"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Correo: {pqr.user?.email || "No disponible"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Rol: {pqr.user?.role || "No disponible"}
                                </Typography>
                            </Box>
                            <Box sx={style.actionsBox}>
                                <ClearableSelect
                                    label="Estado"
                                    value={statusChanges[pqr.id] || pqr.status}
                                    required
                                    size="small"
                                    minWidth="220px"
                                    options={pqrStatusOptions}
                                    onChange={(value) => handleStatusChange(pqr.id, value)}
                                />

                                <Button
                                    variant="contained"
                                    sx={style.button}
                                    onClick={() => handleUpdateStatus(pqr.id)}
                                >
                                    Guardar estado
                                </Button>

                            </Box>
                            {pqr.status !== "RESPONDIDA" && (
                                <Box sx={style.responseForm}>
                                    <TextField
                                        label="Respuesta para el usuario"
                                        placeholder="Escribe aquí la respuesta de la PQR..."
                                        value={responseTexts[pqr.id] || ""}
                                        onChange={(e) => handleResponseTextChange(pqr.id, e.target.value)}
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        slotProps={{
                                            htmlInput: {
                                                maxLength: 500,
                                            },
                                        }}
                                        error={!!responseErrors[pqr.id]}
                                        helperText={
                                            responseErrors[pqr.id]
                                                ? responseErrors[pqr.id]
                                                : `${responseTexts[pqr.id]?.length || 0}/500`
                                        }
                                    />
                                    <Button
                                        variant="outlined"
                                        sx={style.responseButton}
                                        onClick={() => handleRespondPqr(pqr.id)}
                                    >
                                        Responder PQR
                                    </Button>
                                </Box>
                            )}

                            {pqr.response && (
                                <Box sx={style.responseBox}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, mb: 0.5 }}
                                    >
                                        Respuesta registrada
                                    </Typography>

                                    <Typography variant="body2">{pqr.response}</Typography>
                                </Box>
                            )}
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default AdminPqrs;