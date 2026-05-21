import {
    Alert,
    Box,
    Button,
    Chip,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useAdminPqrs } from "../../hooks/useAdminPqrs";
import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
    pqrStatusOptions,
} from "../../utils/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import ClearableSelect from "../../components/common/ClearableSelect";

// Página administrativa para consultar, responder y cambiar estados de PQR.
const AdminPqrs = () => {
    const theme = useTheme();

    const {
        pqrs,
        loading,
        error,

        successMessage,
        successPqrId,

        statusChanges,
        responseTexts,
        responseErrors,

        handleStatusChange,
        handleUpdateStatus,
        handleResponseTextChange,
        handleRespondPqr,
    } = useAdminPqrs();

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
            textTransform: "none",
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
            textTransform: "none",
        },
    };

    if (loading) {
        return <LoadingBox />;
    }

    return (
        <Box sx={style.container}>
            <PageHeader
                title="Todas las PQR"
                subtitle="Administra y revisa las peticiones, quejas, reclamos o solicitudes registradas por los usuarios."
            />

            {error && (
                <Alert severity="error" sx={{ marginBottom: "16px" }}>
                    {error}
                </Alert>
            )}

            {pqrs.length === 0 ? (
                <EmptyState
                    title="No hay PQR registradas"
                    description="Cuando los usuarios creen PQR, aparecerán en este espacio."
                />
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

                            {pqr.response && (
                                <Box sx={style.responseBox}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 0.5,
                                        }}
                                    >
                                        Respuesta registrada
                                    </Typography>

                                    <Typography variant="body2">{pqr.response}</Typography>
                                </Box>
                            )}

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

                            {pqr.status !== "CERRADA" && (
                                <Box sx={style.responseForm}>
                                    <TextField
                                        label="Respuesta para el usuario"
                                        placeholder="Escribe aquí la respuesta de la PQR..."
                                        value={responseTexts[pqr.id] || ""}
                                        onChange={(event) =>
                                            handleResponseTextChange(pqr.id, event.target.value)
                                        }
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
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default AdminPqrs;