import {
    Alert,
    Box,
    Chip,
    Divider,
    Paper,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import { useMyPqrs } from "../../hooks/useMyPqrs";
import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import { pqrStatusOptions } from "../../data/pqrOptions";

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
            p: {
                xs: 2,
                md: 2.5,
            },
            borderRadius: "22px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
            transition: "all 0.2s ease",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
            },
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

        cardTitleBox: {
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
        },

        cardTitle: {
            fontWeight: 600,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
        },

        dateBox: {
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            color: theme.palette.text.secondary,
        },

        description: {
            color: theme.palette.text.secondary,
            mt: 1,
            lineHeight: 1.7,
        },

        responseBox: {
            mt: 2.5,
            p: 2,
            borderRadius: 3,
            backgroundColor: theme.palette.primary.light,
            // border: `1px solid ${theme.palette.primary.main}`,
        },

        responseTitle: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 800,
            mb: 0.8,
            color: theme.palette.primary.dark,
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
                    {pqrs.map((pqr) => {
                        const currentStatusLabel =
                            pqrStatusOptions.find(
                                (option) => option.value === pqr.status
                            )?.label || pqr.status;
                        return (
                            <Paper key={pqr.id} sx={style.card}>
                                <Box sx={style.cardHeader}>
                                    <Box sx={style.cardTitleBox}>
                                        <Typography variant="h6" sx={style.cardTitle}>
                                            {getCaseTypeLabel(pqr.caseType)}
                                        </Typography>

                                        <Box sx={style.dateBox}>
                                            <CalendarMonthOutlinedIcon fontSize="small" />
                                            <Typography variant="body2" sx={style.date}>
                                                Creada el {formatDate(pqr.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Chip
                                        label={currentStatusLabel}
                                        color={getStatusColor(pqr.status)}
                                        size="small"
                                        sx={{ fontWeight: 700 }}
                                    />
                                </Box>

                                <Divider />

                                <Typography variant="body2" sx={style.description}>
                                    {pqr.description}
                                </Typography>

                                {/* Respuesta registrada por ADMIN o AGENT */}
                                {pqr.response && (
                                    <Box sx={style.responseBox}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={style.responseTitle}
                                        >
                                            <QuestionAnswerOutlinedIcon fontSize="small" />
                                            Respuesta recibida
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {pqr.response}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        )
                    })}
                </Box>
            )}
        </Box>
    );
};

export default MyPqrs;