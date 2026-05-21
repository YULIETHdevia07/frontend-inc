import {
    Alert,
    Box,
    Chip,
    Paper,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useMyPqrs } from "../../hooks/useMyPqrs";
import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";

// Página donde el usuario consulta las PQR que ha creado.
const MyPqrs = () => {
    const theme = useTheme();

    const {
        pqrs,
        loading,
        error,
    } = useMyPqrs();

    const style = {
        container: {
            width: "100%",
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
            flexDirection: {
                xs: "column",
                sm: "row",
            },
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
            mt: 1,
            color: theme.palette.text.secondary,
            fontSize: "0.85rem",
        },
    };

    if (loading) {
        return <LoadingBox />;
    }

    return (
        <Box sx={style.container}>
            <PageHeader
                title="Mis PQR"
                subtitle="Consulta el estado de tus peticiones, quejas, reclamos o solicitudes."
            />

            {/* Mensaje de error al cargar las PQR */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Estado vacío cuando el usuario no tiene PQR */}
            {pqrs.length === 0 ? (
                <EmptyState
                    title="No tienes PQR registradas"
                    description="Cuando crees una PQR, aparecerá en este espacio."
                />
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

                            {/* Respuesta registrada por ADMIN o AGENT */}
                            {pqr.response && (
                                <Box sx={style.responseBox}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, mb: 0.5 }}
                                    >
                                        Respuesta recibida
                                    </Typography>

                                    <Typography variant="body2">
                                        {pqr.response}
                                    </Typography>
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