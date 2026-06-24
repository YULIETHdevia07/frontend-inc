import { useState, type MouseEvent } from "react";
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import type { PqrPriority, PqrStatus } from "../../interfaces/pqrs/pqr.interface";

import { useAdminPqrs } from "../../hooks/pqrs/useAdminPqrs";
import { usePqrChat } from "../../hooks/pqrs/usePqrChat";

import {
    getCaseTypeLabel,
} from "../../utils/pqrs/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import { getFilterStyles } from "../../styles/filterStyles";
import { pqrPriorityOptions, pqrStatusOptions } from "../../data/pqrOptions";
import { PqrChatView } from "../../components/pqr/PqrChatView";
import { useAuth } from "../../context/AuthContext";
import PqrTicketCard from "../../components/pqr/PqrTicketCard";

// Página administrativa para consultar, cambiar estados, prioridades y dar seguimiento a las PQR.
const AdminPqrs = () => {
    const theme = useTheme();
    const filterStyles = getFilterStyles(theme);

    const {
        pqrs,
        agents,
        loading,
        error,

        updatingStatusId,
        updatingPriorityId,
        assigningPqrId,

        statusChanges,
        priorityChanges,
        agentChanges,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAllPqrs,
        handleStatusChange,
        handleUpdateStatus,
        handlePriorityChange,
        handleUpdatePriority,
        handleAgentChange,
        handleAssignPqr,
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
        selectedFile,
        handleSelectFile,
        handleRemoveSelectedFile,
        loadingMessages,
        sendingAttachment,
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
            `${pqr.id}`.includes(normalizedSearch) ||
            `pqr-${pqr.id}`.includes(normalizedSearch) ||
            `#pqr-${pqr.id}`.includes(normalizedSearch) ||
            pqr.description.toLowerCase().includes(normalizedSearch) ||
            pqr.caseType.toLowerCase().includes(normalizedSearch) ||
            // pqr.status.toLowerCase().includes(normalizedSearch) ||
            // pqr.priority?.toLowerCase().includes(normalizedSearch) ||
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
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                xl: "1fr 1fr 1fr",
            },
            gap: 1.5,
            alignItems: "start",
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
                    selectedFile={selectedFile}
                    loadingMessages={loadingMessages}
                    sendingAttachment={sendingAttachment}
                    chatError={chatError}
                    currentUserRole={user.role}
                    onBack={closePqrChat}
                    onMessageChange={setMessageText}
                    onSendMessage={handleSendMessage}
                    onSelectFile={handleSelectFile}
                    onRemoveSelectedFile={handleRemoveSelectedFile}
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
                        <PqrTicketCard
                            key={pqr.id}
                            pqr={pqr}
                            activeView="ASSIGNED"
                            takingPqrId={null}
                            onTakePqr={() => { }}
                            updatingStatusId={updatingStatusId}
                            updatingPriorityId={updatingPriorityId}
                            statusValue={statusChanges[pqr.id] || pqr.status}
                            priorityValue={
                                priorityChanges[pqr.id] || pqr.priority || ""
                            }
                            onStatusChange={handleStatusChange}
                            onUpdateStatus={handleUpdateStatus}
                            onPriorityChange={handlePriorityChange}
                            onUpdatePriority={handleUpdatePriority}
                            onOpenChat={openPqrChat}
                            agents={agents}
                            selectedAgentId={
                                agentChanges[pqr.id] || pqr.assignedToId || ""
                            }
                            assigningPqrId={assigningPqrId}
                            onAgentChange={handleAgentChange}
                            onAssignPqr={handleAssignPqr}
                        />
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