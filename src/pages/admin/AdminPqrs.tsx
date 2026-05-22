import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";

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
import CustomSnackbar from "../../components/common/CustomSnackbar";

// Página administrativa para consultar, responder y cambiar estados de PQR.
const AdminPqrs = () => {
    const theme = useTheme();

    const {
        pqrs,
        loading,
        error,

        updatingStatusId,
        respondingPqrId,

        statusChanges,
        responseTexts,
        responseErrors,

        message,
        messageType,
        openMessage,
        closeMessage,

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
            flexDirection: "column",
            gap: 1.3,
            mb: 1.5,
        },

        cardHeaderTop: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexDirection: {
                xs: "column",
                sm: "row",
            },
        },

        cardTitleBox: {
            display: "flex",
            flexDirection: "column",
            gap: 0.6,
        },

        cardTitle: {
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
        },

        dateBox: {
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            color: theme.palette.text.secondary,
        },

        date: {
            color: theme.palette.text.secondary,
            fontSize: "0.84rem",
        },

        infoRow: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: {
                xs: 1,
                sm: 2,
            },
        },

        infoItem: {
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            minWidth: {
                xs: "100%",
                sm: "auto",
            },
        },

        infoLabel: {
            fontSize: "0.72rem",
            fontWeight: 700,
            color: theme.palette.text.secondary,
            textTransform: "uppercase",
            letterSpacing: 0.4,
        },

        infoText: {
            fontSize: "0.84rem",
            color: theme.palette.text.secondary,
        },

        agentText: {
            fontSize: "0.84rem",
            color: theme.palette.success.main,
            fontWeight: 600,
        },

        noAgentText: {
            fontSize: "0.84rem",
            color: theme.palette.text.disabled,
            fontStyle: "italic",
        },

        statusChip: {
            fontWeight: 700,
            borderRadius: "10px",
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

        responseTitle: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 800,
            mb: 0.8,
            color: theme.palette.primary.dark,
        },

        actionsBox: {
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                md: "280px 1fr",
            },
            gap: 2,
            alignItems: "flex-start",
        },

        statusBox: {
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary.light}`,
        },

        fieldLabel: {
            fontWeight: 700,
            mb: 1,
            color: theme.palette.text.primary,
        },

        button: {
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
            textTransform: "none",
        },

        responseForm: {
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary.light}`,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
        },

        responseInput: {
            "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: theme.palette.background.paper,
            },
        },

        responseButton: {
            alignSelf: "flex-start",
            borderRadius: "14px",
            fontWeight: 800,
            px: 3,
            textTransform: "none",
        },

        errorAlert: {
            mb: 2,
            borderRadius: 2,
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
                <Alert severity="error" sx={style.errorAlert}>
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
                    {pqrs.map((pqr) => {
                        const currentStatusLabel =
                            pqrStatusOptions.find(
                                (option) => option.value === pqr.status
                            )?.label || pqr.status;

                        return (
                            <Paper key={pqr.id} sx={style.card}>

                                <Box sx={style.cardHeader}>
                                    <Box sx={style.cardHeaderTop}>
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
                                            sx={style.statusChip}
                                        />
                                    </Box>

                                    <Box sx={style.infoRow}>
                                        <Box sx={style.infoItem}>
                                            <PersonOutlineOutlinedIcon
                                                fontSize="small"
                                                sx={{ color: theme.palette.text.secondary }}
                                            />

                                            <Box>
                                                <Typography sx={style.infoLabel}>
                                                    Solicitante
                                                </Typography>

                                                <Typography sx={style.infoText}>
                                                    {pqr.user?.name || "No disponible"} · {pqr.user?.email || "No disponible"}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={style.infoItem}>
                                            {pqr.assignedTo ? (
                                                <>
                                                    <SupportAgentOutlinedIcon
                                                        fontSize="small"
                                                        sx={{ color: theme.palette.success.main }}
                                                    />

                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                ...style.infoLabel,
                                                                color: theme.palette.success.main,
                                                            }}
                                                        >
                                                            Agente
                                                        </Typography>

                                                        <Typography sx={style.agentText}>
                                                            {pqr.assignedTo.name} · {pqr.assignedTo.email}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            ) : (
                                                <>
                                                    <PersonOffOutlinedIcon
                                                        fontSize="small"
                                                        sx={{ color: theme.palette.text.disabled }}
                                                    />

                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                ...style.infoLabel,
                                                                color: theme.palette.text.disabled,
                                                            }}
                                                        >
                                                            Agente
                                                        </Typography>

                                                        <Typography sx={style.noAgentText}>
                                                            Sin agente asignado
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>


                                <Divider />

                                <Typography variant="body2" sx={style.description}>
                                    {pqr.description}
                                </Typography>


                                {pqr.response && (
                                    <Box sx={style.responseBox}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={style.responseTitle}
                                        >
                                            <QuestionAnswerOutlinedIcon fontSize="small" />
                                            Respuesta registrada
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {pqr.response}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={style.actionsBox}>
                                    <Box sx={style.statusBox}>
                                        <Typography variant="body2" sx={style.fieldLabel}>
                                            Cambiar estado
                                        </Typography>

                                        <ClearableSelect
                                            label="Estado"
                                            value={statusChanges[pqr.id] || pqr.status}
                                            disabled={pqr.status == "CERRADA"}
                                            required
                                            size="small"
                                            minWidth="100%"
                                            options={pqrStatusOptions}
                                            onChange={(value) =>
                                                handleStatusChange(pqr.id, value)
                                            }
                                        />

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            disabled={updatingStatusId === pqr.id || pqr.status === "CERRADA"}
                                            sx={{
                                                ...style.button,
                                                mt: 1.5,
                                            }}
                                            onClick={() => handleUpdateStatus(pqr.id)}
                                        >
                                            {updatingStatusId === pqr.id ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                "Guardar estado"
                                            )}
                                        </Button>
                                    </Box>

                                    <Box sx={style.responseForm}>
                                        <TextField
                                            label="Respuesta para el usuario"
                                            placeholder="Escribe aquí la respuesta de la PQR..."
                                            disabled={pqr.status == "CERRADA"}
                                            value={responseTexts[pqr.id] || ""}
                                            onChange={(event) =>
                                                handleResponseTextChange(
                                                    pqr.id,
                                                    event.target.value
                                                )
                                            }
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            sx={style.responseInput}
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
                                            disabled={respondingPqrId === pqr.id || pqr.status === "CERRADA"}
                                            sx={style.responseButton}
                                            startIcon={<SendOutlinedIcon />}
                                            onClick={() => handleRespondPqr(pqr.id)}
                                        >
                                            {respondingPqrId === pqr.id ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                "Responder PQR"
                                            )}
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            )}

            {/* Mensajes de éxito, error o advertencia */}
            <CustomSnackbar
                open={openMessage}
                message={message}
                severity={messageType}
                onClose={closeMessage}
            />
        </Box>
    );
};

export default AdminPqrs;