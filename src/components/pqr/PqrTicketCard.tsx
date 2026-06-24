import {
    Badge,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import type { PqrPriority, PqrStatus } from "../../interfaces/pqrs/pqr.interface";
import type { User } from "../../interfaces/users/user.interface";

import { formatDate } from "../../utils/common/dateUtils";
import {
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrs/pqrUtils";
import { pqrPriorityOptions, pqrStatusOptions } from "../../data/pqrOptions";

import ClearableSelect from "../common/ClearableSelect";
import PqrRatingSummary from "./PqrRatingSummary";

type PqrTicketCardProps = {
    pqr: {
        id: number;
        caseType: string;
        description: string;
        status: PqrStatus;
        priority?: PqrPriority | null;
        createdAt: string;
        assignedToId?: number | null;
        unreadMessagesCount?: number;
        rating?: number | null;
        ratingComment?: string | null;
        ratedAt?: string | null;
        user?: {
            name?: string | null;
            email?: string | null;
        } | null;
        assignedTo?: {
            name?: string | null;
            email?: string | null;
        } | null;
    };

    activeView: "AVAILABLE" | "ASSIGNED";

    takingPqrId: number | null;
    updatingStatusId: number | null;
    updatingPriorityId: number | null;

    assigningPqrId?: number | null;

    statusValue: PqrStatus;
    priorityValue: PqrPriority | "";

    agents?: User[];
    selectedAgentId?: number | "";

    onTakePqr: (pqrId: number) => void;
    onStatusChange: (pqrId: number, value: PqrStatus) => void;
    onUpdateStatus: (pqrId: number) => void;
    onPriorityChange: (pqrId: number, value: PqrPriority) => void;
    onUpdatePriority: (pqrId: number) => void;
    onOpenChat: (pqrId: number) => void;

    onAgentChange?: (pqrId: number, value: string) => void;
    onAssignPqr?: (pqrId: number) => void;
};

const PqrTicketCard = ({
    pqr,
    activeView,
    takingPqrId,
    updatingStatusId,
    updatingPriorityId,
    assigningPqrId,
    statusValue,
    priorityValue,
    agents = [],
    selectedAgentId = "",
    onTakePqr,
    onStatusChange,
    onUpdateStatus,
    onPriorityChange,
    onUpdatePriority,
    onOpenChat,
    onAgentChange,
    onAssignPqr,
}: PqrTicketCardProps) => {
    const theme = useTheme();

    // Obtiene la cantidad de mensajes no leídos de la PQR.
    const unreadMessagesCount = pqr.unreadMessagesCount ?? 0;

    // Convierte la lista de agentes en opciones para el selector.
    const agentOptions = agents.map((agent) => ({
        value: String(agent.id),
        label: `${agent.name} (${agent.email})`,
    }));

    // Convierte el agente seleccionado a número para poder compararlo.
    const selectedAgentNumber = selectedAgentId
        ? Number(selectedAgentId)
        : null;

    // Obtiene el agente que actualmente tiene asignada la PQR.
    const currentAssignedAgentId = pqr.assignedToId ?? null;

    // Valida si el agente seleccionado es el mismo que ya está asignado.
    const isSameAssignedAgent =
        currentAssignedAgentId !== null &&
        selectedAgentNumber === currentAssignedAgentId;

    // Controla si el botón Asignar o Reasignar debe estar habilitado.
    const canAssignOrReassign =
        selectedAgentNumber !== null &&
        !isSameAssignedAgent &&
        pqr.status !== "CERRADA";

    // Obtiene el estado seleccionado en el formulario.
    const selectedStatus = statusValue || null;

    // Obtiene el estado actual de la PQR.
    const currentStatus = pqr.status;

    // Controla si el botón Guardar estado debe estar habilitado.
    const canUpdateStatus =
        selectedStatus !== null &&
        selectedStatus !== currentStatus &&
        pqr.status !== "CERRADA";

    // Obtiene la prioridad seleccionada en el formulario.
    const selectedPriority = priorityValue || null;

    // Obtiene la prioridad actual de la PQR.
    const currentPriority = pqr.priority ?? null;

    // Controla si el botón Guardar prioridad debe estar habilitado.
    const canUpdatePriority =
        selectedPriority !== null &&
        selectedPriority !== currentPriority &&
        pqr.status !== "CERRADA";

    // Obtiene el texto que se muestra para la prioridad.
    const getPriorityLabel = (priority?: PqrPriority | null) => {
        return (
            pqrPriorityOptions.find((option) => option.value === priority)
                ?.label ||
            priority ||
            "Sin prioridad"
        );
    };

    // Obtiene el texto que se muestra para el estado.
    const getStatusLabel = (status: PqrStatus) => {
        return (
            pqrStatusOptions.find((option) => option.value === status)?.label ||
            status
        );
    };

    const style = {
        card: {
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.07)",
            overflow: "hidden",
            transition: "all 0.2s ease",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 16px 34px rgba(15, 23, 42, 0.12)",
                borderColor: alpha(theme.palette.primary.main, 0.35),
            },
        },

        cardContent: {
            p: 2,
        },

        cardHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
            mb: 1.2,
        },

        idText: {
            fontSize: "0.78rem",
            fontWeight: 900,
            color: theme.palette.primary.main,
            mb: 0.3,
        },

        cardTitle: {
            fontWeight: 900,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            fontSize: "1rem",
        },

        chipBox: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.6,
            flexShrink: 0,
        },

        statusChip: {
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "0.72rem",
            height: 24,
        },

        priorityChip: {
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "0.72rem",
            height: 24,
            backgroundColor: alpha(theme.palette.warning.main, 0.12),
            color: theme.palette.warning.dark,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.35)}`,
            "& .MuiChip-icon": {
                color: theme.palette.warning.dark,
                fontSize: 16,
            },
        },

        metaBox: {
            display: "flex",
            flexDirection: "column",
            gap: 0.7,
            mb: 1.3,
        },

        metaItem: {
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            color: theme.palette.text.secondary,
            minWidth: 0,
        },

        metaText: {
            fontSize: "0.82rem",
            color: theme.palette.text.secondary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },

        agentText: {
            fontSize: "0.82rem",
            color: theme.palette.success.main,
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },

        noAgentText: {
            fontSize: "0.82rem",
            color: theme.palette.text.disabled,
            fontStyle: "italic",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },

        descriptionBlock: {
            mt: 1.3,
            p: 1.4,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.primary.light, 0.42),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
        },

        descriptionLabel: {
            mb: 0.5,
            fontSize: "0.72rem",
            fontWeight: 900,
            color: theme.palette.primary.main,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
        },

        description: {
            color: theme.palette.text.secondary,
            fontSize: "0.88rem",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 62,
        },

        ratingBox: {
            mt: 1.2,
        },

        footer: {
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
        },

        assignedActions: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1,
        },

        actionRow: {
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr auto",
            },
            gap: 0.8,
            alignItems: "center",
        },

        smallButton: {
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 800,
            minHeight: 36,
            boxShadow: "none",
            whiteSpace: "nowrap",
        },

        chatButton: {
            mt: 0.2,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 800,
            minHeight: 36,
            boxShadow: "none",
        },

        takeButton: {
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 900,
            minHeight: 38,
            boxShadow: "none",
            width: "100%",
        },
    };

    return (
        <Paper sx={style.card}>
            <Box sx={style.cardContent}>
                <Box sx={style.cardHeader}>
                    <Box>
                        <Typography sx={style.idText}>
                            #PQR-{pqr.id}
                        </Typography>

                        <Typography sx={style.cardTitle}>
                            {getCaseTypeLabel(pqr.caseType)}
                        </Typography>
                    </Box>

                    <Box sx={style.chipBox}>
                        <Chip
                            label={getStatusLabel(pqr.status)}
                            color={getStatusColor(pqr.status)}
                            size="small"
                            sx={style.statusChip}
                        />

                        {pqr.priority && (
                            <Chip
                                icon={<FlagOutlinedIcon />}
                                label={getPriorityLabel(pqr.priority)}
                                size="small"
                                sx={style.priorityChip}
                            />
                        )}
                    </Box>
                </Box>

                <Box sx={style.metaBox}>
                    <Box sx={style.metaItem}>
                        <CalendarMonthOutlinedIcon fontSize="small" />

                        <Typography sx={style.metaText}>
                            {formatDate(pqr.createdAt)}
                        </Typography>
                    </Box>

                    <Box sx={style.metaItem}>
                        <PersonOutlineOutlinedIcon fontSize="small" />

                        <Typography sx={style.metaText}>
                            {pqr.user?.name || "Usuario no disponible"} ·{" "}
                            {pqr.user?.email || "Correo no disponible"}
                        </Typography>
                    </Box>

                    {"assignedTo" in pqr && (
                        <Box sx={style.metaItem}>
                            {pqr.assignedTo ? (
                                <>
                                    <SupportAgentOutlinedIcon
                                        fontSize="small"
                                        sx={{
                                            color: theme.palette.success.main,
                                        }}
                                    />

                                    <Typography sx={style.agentText}>
                                        {pqr.assignedTo.name || "Agente"} ·{" "}
                                        {pqr.assignedTo.email ||
                                            "Correo no disponible"}
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <PersonOffOutlinedIcon
                                        fontSize="small"
                                        sx={{
                                            color: theme.palette.text.disabled,
                                        }}
                                    />

                                    <Typography sx={style.noAgentText}>
                                        Sin agente asignado
                                    </Typography>
                                </>
                            )}
                        </Box>
                    )}
                </Box>

                <Box sx={style.descriptionBlock}>
                    <Typography sx={style.descriptionLabel}>
                        Descripción
                    </Typography>

                    <Tooltip
                        title={pqr.description}
                        arrow
                        placement="top"
                        enterTouchDelay={0}
                    >
                        <Typography sx={style.description}>
                            {pqr.description}
                        </Typography>
                    </Tooltip>
                </Box>

                {pqr.rating !== null && pqr.rating !== undefined && (
                    <Box sx={style.ratingBox}>
                        <PqrRatingSummary
                            rating={pqr.rating}
                            ratingComment={pqr.ratingComment}
                            ratedAt={pqr.ratedAt}
                        />
                    </Box>
                )}

                <Divider sx={{ mt: 1.5 }} />

                <Box sx={style.footer}>
                    {activeView === "AVAILABLE" && (
                        <Button
                            variant="contained"
                            startIcon={
                                takingPqrId === pqr.id ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <AssignmentTurnedInOutlinedIcon />
                                )
                            }
                            disabled={takingPqrId === pqr.id}
                            onClick={() => onTakePqr(pqr.id)}
                            sx={style.takeButton}
                        >
                            {takingPqrId === pqr.id
                                ? "Asignando..."
                                : "Tomar PQR"}
                        </Button>
                    )}

                    {activeView === "ASSIGNED" && (
                        <Box sx={style.assignedActions}>
                            {/* Selector usado por ADMIN para asignar o reasignar una PQR. */}
                            {onAgentChange && onAssignPqr && (
                                <Box sx={style.actionRow}>
                                    <ClearableSelect
                                        label="Agente responsable"
                                        value={
                                            selectedAgentId
                                                ? String(selectedAgentId)
                                                : ""
                                        }
                                        disabled={pqr.status === "CERRADA"}
                                        size="small"
                                        minWidth="100%"
                                        options={agentOptions}
                                        onChange={(value) =>
                                            onAgentChange(pqr.id, value)
                                        }
                                    />

                                    <Button
                                        variant="contained"
                                        disabled={
                                            assigningPqrId === pqr.id ||
                                            !canAssignOrReassign
                                        }
                                        onClick={() => onAssignPqr(pqr.id)}
                                        sx={style.smallButton}
                                    >
                                        {assigningPqrId === pqr.id ? (
                                            <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                        ) : pqr.assignedToId ? (
                                            "Reasignar"
                                        ) : (
                                            "Asignar"
                                        )}
                                    </Button>
                                </Box>
                            )}

                            {/* Selector usado para cambiar el estado de una PQR. */}
                            <Box sx={style.actionRow}>
                                <ClearableSelect
                                    label="Estado"
                                    value={statusValue}
                                    disabled={pqr.status === "CERRADA"}
                                    required
                                    size="small"
                                    minWidth="100%"
                                    options={pqrStatusOptions}
                                    onChange={(value) =>
                                        onStatusChange(
                                            pqr.id,
                                            value as PqrStatus
                                        )
                                    }
                                />

                                <Button
                                    variant="contained"
                                    disabled={
                                        updatingStatusId === pqr.id ||
                                        !canUpdateStatus
                                    }
                                    onClick={() => onUpdateStatus(pqr.id)}
                                    sx={style.smallButton}
                                >
                                    {updatingStatusId === pqr.id ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        "Guardar"
                                    )}
                                </Button>
                            </Box>

                            {/* Selector usado para cambiar la prioridad de una PQR. */}
                            <Box sx={style.actionRow}>
                                <ClearableSelect
                                    label="Prioridad"
                                    value={priorityValue}
                                    disabled={pqr.status === "CERRADA"}
                                    required
                                    size="small"
                                    minWidth="100%"
                                    options={pqrPriorityOptions}
                                    onChange={(value) =>
                                        onPriorityChange(
                                            pqr.id,
                                            value as PqrPriority
                                        )
                                    }
                                />

                                <Button
                                    variant="contained"
                                    disabled={
                                        updatingPriorityId === pqr.id ||
                                        !canUpdatePriority
                                    }
                                    onClick={() => onUpdatePriority(pqr.id)}
                                    sx={style.smallButton}
                                >
                                    {updatingPriorityId === pqr.id ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        "Guardar"
                                    )}
                                </Button>
                            </Box>

                            {/* Abre el chat de la PQR y muestra mensajes no leídos. */}
                            <Button
                                variant="outlined"
                                onClick={() => onOpenChat(pqr.id)}
                                startIcon={
                                    <Badge
                                        badgeContent={unreadMessagesCount}
                                        color="error"
                                        invisible={unreadMessagesCount === 0}
                                    >
                                        <ForumOutlinedIcon />
                                    </Badge>
                                }
                                sx={style.chatButton}
                            >
                                Responder por chat
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default PqrTicketCard;