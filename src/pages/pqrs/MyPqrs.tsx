import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Paper,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Pqr, PqrStatus } from "../../services/pqrService";
import { getMyPqrs } from "../../services/pqrService";

const MyPqrs = () => {
    const theme = useTheme();

    const [pqrs, setPqrs] = useState<Pqr[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

        responseBox: {
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.light,
        },

        date: {
            mt: 2,
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

    const getCaseTypeLabel = (caseType: string) => {
    switch (caseType) {
        case "SAP":
            return "SAP";

        case "DANO_EQUIPO":
            return "Daño de equipo";

        case "INSTALACION":
            return "Instalación";

        case "OTRO":
            return "Otro";

        default:
            return caseType;
    }
};

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const loadMyPqrs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyPqrs();

            setPqrs(response.pqrs);
        } catch (error) {
            console.error(error);
            setError("Error al cargar las PQR.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyPqrs();
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
                    Mis PQR
                </Typography>

                <Typography variant="body2" sx={style.subtitle}>
                    Consulta el estado de tus peticiones, quejas, reclamos o solicitudes.
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
                        No tienes PQR registradas
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Cuando crees una PQR, aparecerá en este espacio.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={style.list}>
                    {pqrs.map((pqr) => (
                        <Paper key={pqr.id} sx={style.card}>
                            <Box sx={style.cardHeader}>
                                <Box>
                                    <Typography variant="h6" sx={style.cardTitle}>
                                        {getCaseTypeLabel(pqr.caseType)}
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

                            {pqr.response && (
                                <Box sx={style.responseBox}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, mb: 0.5 }}
                                    >
                                        Respuesta del administrador
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

export default MyPqrs;