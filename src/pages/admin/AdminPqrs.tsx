import { useState, type MouseEvent } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

import type { PqrPriority, PqrStatus } from "../../interfaces/pqr.interface";

import { useAdminPqrs } from "../../hooks/useAdminPqrs";
import { usePqrChat } from "../../hooks/usePqrChat";

import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import ClearableSelect from "../../components/common/ClearableSelect";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import { getFilterStyles } from "../../styles/filterStyles";
import { pqrPriorityOptions, pqrStatusOptions } from "../../data/pqrOptions";
import PqrRatingSummary from "../../components/pqr/PqrRatingSummary";
import { PqrChatView } from "../../components/pqr/PqrChatView";
import { useAuth } from "../../context/AuthContext";

// Página administrativa para consultar, cambiar estados, prioridades y dar seguimiento a las PQR.
const AdminPqrs = () => {
    const theme = useTheme();
    const filterStyles = getFilterStyles(theme);

    const {
        pqrs,
        loading,
        error,

        updatingStatusId,
        updatingPriorityId,

        statusChanges,
        priorityChanges,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAllPqrs,
        handleStatusChange,
        handleUpdateStatus,
        handlePriorityChange,
        handleUpdatePriority,
    } = useAdminPqrs();

    // Controla el texto escrito en el buscador.
    const [searchTerm, setSearchTerm] = useState("");

    // Controla si el buscador está visible o solo se muestra el ícono.
    const [showSearch, setShowSearch] = useState(false);

    // Controla el filtro por estado de la PQR.
    const [statusFilter, setStatusFilter] = useState<"ALL" | PqrStatus>("ALL");

    const [priorityFilter, setPriorityFilter] = useState<"ALL" | PqrPriority>(
        "ALL"
    );

    // Controla el filtro por tipo de caso de la PQR.
    const [caseTypeFilter, setCaseTypeFilter] = useState("ALL");

    // Controla el filtro para saber si la PQR tiene o no agente asignado.
    const [agentFilter, setAgentFilter] = useState<
        "ALL" | "WITH_AGENT" | "WITHOUT_AGENT"
    >("ALL");

    // Controla la fecha inicial del filtro por rango.
    const [startDateFilter, setStartDateFilter] = useState("");

    // Controla la fecha final del filtro por rango.
    const [endDateFilter, setEndDateFilter] = useState("");

    // Controla la apertura del menú de filtros.
    const [filterAnchorEl, setFilterAnchorEl] =
        useState<null | HTMLElement>(null);

    const [selectedChatPqrId, setSelectedChatPqrId] = useState<number | null>(
        null
    );

    const { token, user } = useAuth();

    const {
        messages,
        messageText,
        setMessageText,
        loadingMessages,
        chatError,
        setChatError,
        handleSendMessage,
    } = usePqrChat({
        pqrId: selectedChatPqrId,
        token,
    });

    const openFilterMenu = Boolean(filterAnchorEl);

    // Muestra el campo de búsqueda.
    const toggleSearch = () => {
        setShowSearch(true);
    };

    // Limpia el texto de búsqueda y oculta el campo.
    const clearSearch = () => {
        setSearchTerm("");
        setShowSearch(false);
    };

    // Abre el menú de filtros.
    const openFilters = (event: MouseEvent<HTMLButtonElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    // Cierra el menú de filtros.
    const closeFilters = () => {
        setFilterAnchorEl(null);
    };

    // Limpia todos los filtros aplicados.
    const clearFilters = () => {
        setStatusFilter("ALL");
        setPriorityFilter("ALL");
        setCaseTypeFilter("ALL");
        setAgentFilter("ALL");
        setStartDateFilter("");
        setEndDateFilter("");
    };

    const openPqrChat = (pqrId: number) => {
        setSelectedChatPqrId(pqrId);
    };

    const closePqrChat = () => {
        setSelectedChatPqrId(null);
    };

    const selectedChatPqr = pqrs.find((pqr) => pqr.id === selectedChatPqrId);

    const getPriorityLabel = (priority?: PqrPriority | null) => {
        return (
            pqrPriorityOptions.find((option) => option.value === priority)
                ?.label ||
            priority ||
            ""
        );
    };

    const getStatusLabel = (status: PqrStatus) => {
        return (
            pqrStatusOptions.find((option) => option.value === status)?.label ||
            status
        );
    };

    // Verifica si existe algún filtro activo.
    const hasActiveFilters =
        statusFilter !== "ALL" ||
        priorityFilter !== "ALL" ||
        caseTypeFilter !== "ALL" ||
        agentFilter !== "ALL" ||
        startDateFilter !== "" ||
        endDateFilter !== "";

    const caseTypeOptions = Array.from(
        new Set(pqrs.map((pqr) => pqr.caseType))
    );

    const filteredPqrs = pqrs.filter((pqr) => {
        const normalizedSearch = searchTerm.toLowerCase().trim();

        const matchesSearch =
            !normalizedSearch ||
            pqr.description.toLowerCase().includes(normalizedSearch) ||
            pqr.caseType.toLowerCase().includes(normalizedSearch) ||
            pqr.status.toLowerCase().includes(normalizedSearch) ||
            pqr.priority?.toLowerCase().includes(normalizedSearch) ||
            pqr.user?.name?.toLowerCase().includes(normalizedSearch) ||
            pqr.user?.email?.toLowerCase().includes(normalizedSearch) ||
            pqr.assignedTo?.name?.toLowerCase().includes(normalizedSearch) ||
            pqr.assignedTo?.email?.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
            statusFilter === "ALL" || pqr.status === statusFilter;

        const matchesPriority =
            priorityFilter === "ALL" || pqr.priority === priorityFilter;

        const matchesCaseType =
            caseTypeFilter === "ALL" || pqr.caseType === caseTypeFilter;

        const matchesAgent =
            agentFilter === "ALL" ||
            (agentFilter === "WITH_AGENT" && !!pqr.assignedTo) ||
            (agentFilter === "WITHOUT_AGENT" && !pqr.assignedTo);

        const createdDate = new Date(pqr.createdAt);

        const startDate = startDateFilter
            ? new Date(`${startDateFilter}T00:00:00`)
            : null;

        const endDate = endDateFilter
            ? new Date(`${endDateFilter}T23:59:59.999`)
            : null;

        const matchesStartDate = !startDate || createdDate >= startDate;
        const matchesEndDate = !endDate || createdDate <= endDate;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesCaseType &&
            matchesAgent &&
            matchesStartDate &&
            matchesEndDate
        );
    });

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

        chipColumn: {
            display: "flex",
            flexDirection: "column",
            alignItems: {
                xs: "flex-start",
                sm: "flex-end",
            },
            gap: 1,
            width: {
                xs: "100%",
                sm: "auto",
            },
        },

        priorityChipBox: {
            display: "flex",
            justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
            },
            width: "100%",
        },

        priorityChip: {
            borderRadius: "999px",
            fontWeight: 800,
            backgroundColor: "#fff7ed",
            color: "#c2410c",
            border: "1px solid #fed7aa",
            maxWidth: "100%",
            "& .MuiChip-icon": {
                color: "#c2410c",
            },
        },

        cardHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 1.5,
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

        date: {
            mt: 1,
            color: theme.palette.text.secondary,
            fontSize: "0.85rem",
        },

        agentText: {
            mt: 1,
            fontSize: "0.85rem",
            color: theme.palette.success.main,
            fontWeight: 600,
        },

        noAgentText: {
            mt: 1,
            fontSize: "0.85rem",
            color: theme.palette.text.disabled,
            fontStyle: "italic",
        },

        statusChip: {
            borderRadius: "999px",
            fontWeight: 800,
            px: 0.5,
            maxWidth: "100%",
        },

        description: {
            color: theme.palette.text.secondary,
            mt: 1,
            lineHeight: 1.7,
        },

        simpleActions: {
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "220px 220px 220px",
            },
            gap: 1.5,
            alignItems: "flex-start",
        },

        simpleBox: {
            display: "flex",
            flexDirection: "column",
            gap: 1,
        },

        simpleLabel: {
            fontSize: "0.8rem",
            fontWeight: 700,
            color: theme.palette.text.secondary,
        },

        simpleButton: {
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
        },

        errorAlert: {
            mb: 2,
            borderRadius: 2,
        },
    };
    if (loading) {
        return <LoadingBox />;
    }

    if (selectedChatPqr && user) {
        return (
            <>
                <PqrChatView
                    pqr={selectedChatPqr}
                    messages={messages}
                    messageText={messageText}
                    loadingMessages={loadingMessages}
                    chatError={chatError}
                    currentUserRole={user.role}
                    onBack={closePqrChat}
                    onMessageChange={setMessageText}
                    onSendMessage={handleSendMessage}
                    onClearError={() => setChatError("")}
                />

                <CustomSnackbar
                    open={openMessage}
                    message={message}
                    severity={messageType}
                    onClose={closeMessage}
                />
            </>
        );
    }

    return (
        <Box sx={style.container}>
            <PageHeader
                title="Todas las PQR"
                subtitle="Administra y revisa las peticiones, quejas, reclamos o solicitudes registradas por los usuarios."
                actions={
                    <>
                        {/* Buscador desplegable para filtrar PQR por texto. */}
                        {showSearch ? (
                            <TextField
                                placeholder="Buscar PQR..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                size="small"
                                autoFocus
                                sx={filterStyles.searchInput}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlinedIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={clearSearch}
                                                >
                                                    <CloseOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        ) : (
                            <Tooltip title="Buscar PQR">
                                <IconButton
                                    onClick={toggleSearch}
                                    sx={
                                        searchTerm
                                            ? filterStyles.activeIconButton
                                            : filterStyles.iconButton
                                    }
                                >
                                    <SearchOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Botón que abre el menú de filtros. */}
                        <Tooltip title="Filtrar PQR">
                            <IconButton
                                onClick={openFilters}
                                sx={
                                    hasActiveFilters
                                        ? filterStyles.activeIconButton
                                        : filterStyles.iconButton
                                }
                            >
                                <FilterListOutlinedIcon />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={filterAnchorEl}
                            open={openFilterMenu}
                            onClose={closeFilters}
                            slotProps={{
                                paper: {
                                    sx: filterStyles.filterMenuPaper,
                                },
                            }}
                        >
                            <Box sx={filterStyles.filterMenuContent}>
                                <Typography
                                    variant="body2"
                                    sx={filterStyles.filterTitle}
                                >
                                    Filtros de PQR
                                </Typography>

                                <Select
                                    fullWidth
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target.value as
                                            | "ALL"
                                            | PqrStatus
                                        )
                                    }
                                    size="small"
                                    sx={filterStyles.filterSelect}
                                >
                                    <MenuItem value="ALL">
                                        Todos los estados
                                    </MenuItem>

                                    {pqrStatusOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Select
                                    fullWidth
                                    value={priorityFilter}
                                    onChange={(event) =>
                                        setPriorityFilter(
                                            event.target.value as
                                            | "ALL"
                                            | PqrPriority
                                        )
                                    }
                                    size="small"
                                    sx={filterStyles.filterSelect}
                                >
                                    <MenuItem value="ALL">
                                        Todas las prioridades
                                    </MenuItem>

                                    {pqrPriorityOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Select
                                    fullWidth
                                    value={caseTypeFilter}
                                    onChange={(event) =>
                                        setCaseTypeFilter(event.target.value)
                                    }
                                    size="small"
                                    sx={filterStyles.filterSelect}
                                >
                                    <MenuItem value="ALL">
                                        Todos los tipos de caso
                                    </MenuItem>

                                    {caseTypeOptions.map((caseType) => (
                                        <MenuItem
                                            key={caseType}
                                            value={caseType}
                                        >
                                            {getCaseTypeLabel(caseType)}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Select
                                    fullWidth
                                    value={agentFilter}
                                    onChange={(event) =>
                                        setAgentFilter(
                                            event.target.value as
                                            | "ALL"
                                            | "WITH_AGENT"
                                            | "WITHOUT_AGENT"
                                        )
                                    }
                                    size="small"
                                    sx={filterStyles.filterSelect}
                                >
                                    <MenuItem value="ALL">
                                        Todas las PQR
                                    </MenuItem>
                                    <MenuItem value="WITH_AGENT">
                                        Con agente asignado
                                    </MenuItem>
                                    <MenuItem value="WITHOUT_AGENT">
                                        Sin agente asignado
                                    </MenuItem>
                                </Select>

                                <Box sx={filterStyles.filterDateRow}>
                                    <TextField
                                        label="Desde"
                                        type="date"
                                        value={startDateFilter}
                                        onChange={(event) =>
                                            setStartDateFilter(
                                                event.target.value
                                            )
                                        }
                                        size="small"
                                        sx={filterStyles.filterDateInput}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Hasta"
                                        type="date"
                                        value={endDateFilter}
                                        onChange={(event) =>
                                            setEndDateFilter(
                                                event.target.value
                                            )
                                        }
                                        size="small"
                                        sx={filterStyles.filterDateInput}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                </Box>

                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={clearFilters}
                                    disabled={!hasActiveFilters}
                                    sx={filterStyles.clearFilterButton}
                                >
                                    Limpiar filtros
                                </Button>
                            </Box>
                        </Menu>

                        <Tooltip title="Actualizar lista">
                            <IconButton
                                onClick={loadAllPqrs}
                                sx={filterStyles.iconButton}
                            >
                                <RefreshOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                }
            />

            {error && (
                <Alert severity="error" sx={style.errorAlert}>
                    {error}
                </Alert>
            )}

            {filteredPqrs.length === 0 ? (
                <EmptyState
                    title="No hay PQR registradas"
                    description="Cuando los usuarios creen PQR, aparecerán en este espacio."
                />
            ) : (
                <Box sx={style.list}>
                    {filteredPqrs.map((pqr) => (
                        <Paper key={pqr.id} sx={style.card}>
                            <Box sx={style.cardHeader}>
                                <Box sx={style.cardTitleBox}>
                                    <Typography
                                        variant="h6"
                                        sx={style.cardTitle}
                                    >
                                        {getCaseTypeLabel(pqr.caseType)}
                                    </Typography>

                                    <Box sx={style.dateBox}>
                                        <CalendarMonthOutlinedIcon fontSize="small" />
                                        <Typography
                                            variant="body2"
                                            sx={style.date}
                                        >
                                            Creada: {formatDate(pqr.createdAt)}
                                        </Typography>
                                    </Box>

                                    <Box sx={style.dateBox}>
                                        <PersonOutlineOutlinedIcon fontSize="small" />
                                        <Typography
                                            variant="body2"
                                            sx={style.date}
                                        >
                                            Usuario:{" "}
                                            {pqr.user?.name ||
                                                "No disponible"}{" "}
                                            ·{" "}
                                            {pqr.user?.email ||
                                                "No disponible"}
                                        </Typography>
                                    </Box>

                                    <Box sx={style.dateBox}>
                                        {pqr.assignedTo ? (
                                            <>
                                                <SupportAgentOutlinedIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: theme.palette
                                                            .success.main,
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={style.agentText}
                                                >
                                                    Agente:{" "}
                                                    {pqr.assignedTo.name} ·{" "}
                                                    {pqr.assignedTo.email}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <PersonOffOutlinedIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: theme.palette.text
                                                            .disabled,
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={style.noAgentText}
                                                >
                                                    Sin agente asignado
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={style.chipColumn}>
                                    {pqr.priority && (
                                        <Box sx={style.priorityChipBox}>
                                            <Chip
                                                icon={<FlagOutlinedIcon />}
                                                label={`Prioridad: ${getPriorityLabel(
                                                    pqr.priority
                                                )}`}
                                                size="small"
                                                sx={style.priorityChip}
                                            />
                                        </Box>
                                    )}

                                    <Chip
                                        label={getStatusLabel(pqr.status)}
                                        color={getStatusColor(pqr.status)}
                                        size="small"
                                        sx={style.statusChip}
                                    />
                                </Box>
                            </Box>

                            <Divider />

                            <Typography variant="body2" sx={style.description}>
                                {pqr.description}
                            </Typography>

                            {pqr.rating !== null &&
                                pqr.rating !== undefined && (
                                    <PqrRatingSummary
                                        rating={pqr.rating}
                                        ratingComment={pqr.ratingComment}
                                        ratedAt={pqr.ratedAt}
                                    />
                                )}

                            <Box sx={style.simpleActions}>
                                <Box sx={style.simpleBox}>
                                    <Typography sx={style.simpleLabel}>
                                        Estado
                                    </Typography>

                                    <ClearableSelect
                                        label="Cambiar estado"
                                        value={
                                            statusChanges[pqr.id] || pqr.status
                                        }
                                        disabled={pqr.status === "CERRADA"}
                                        required
                                        size="small"
                                        minWidth="100%"
                                        options={pqrStatusOptions}
                                        onChange={(value) =>
                                            handleStatusChange(pqr.id, value)
                                        }
                                    />

                                    <Button
                                        variant="contained"
                                        disabled={
                                            updatingStatusId === pqr.id ||
                                            pqr.status === "CERRADA"
                                        }
                                        sx={style.simpleButton}
                                        onClick={() =>
                                            handleUpdateStatus(pqr.id)
                                        }
                                    >
                                        {updatingStatusId === pqr.id ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : (
                                            "Guardar"
                                        )}
                                    </Button>
                                </Box>

                                <Box sx={style.simpleBox}>
                                    <Typography sx={style.simpleLabel}>
                                        Prioridad
                                    </Typography>

                                    <ClearableSelect
                                        label="Cambiar prioridad"
                                        value={
                                            priorityChanges[pqr.id] ||
                                            pqr.priority ||
                                            ""
                                        }
                                        disabled={pqr.status === "CERRADA"}
                                        required
                                        size="small"
                                        minWidth="100%"
                                        options={pqrPriorityOptions}
                                        onChange={(value) =>
                                            handlePriorityChange(pqr.id, value)
                                        }
                                    />

                                    <Button
                                        variant="contained"
                                        disabled={
                                            updatingPriorityId === pqr.id ||
                                            pqr.status === "CERRADA"
                                        }
                                        sx={style.simpleButton}
                                        onClick={() =>
                                            handleUpdatePriority(pqr.id)
                                        }
                                    >
                                        {updatingPriorityId === pqr.id ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : (
                                            "Guardar"
                                        )}
                                    </Button>
                                </Box>

                                <Box sx={style.simpleBox}>
                                    <Typography sx={style.simpleLabel}>
                                        Seguimiento
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        sx={style.simpleButton}
                                        startIcon={<ForumOutlinedIcon />}
                                        onClick={() => openPqrChat(pqr.id)}
                                    >
                                        Ver chat
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
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