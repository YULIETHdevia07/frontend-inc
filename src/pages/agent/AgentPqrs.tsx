import { useState } from "react";
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
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

import type { PqrPriority, PqrStatus } from "../../interfaces/pqr.interface";

import { useAgentPqrs } from "../../hooks/useAgentPqrs";
import { useAuth } from "../../context/AuthContext";
import { usePqrChat } from "../../hooks/usePqrChat";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import { getFilterStyles } from "../../styles/filterStyles";
import { pqrPriorityOptions, pqrStatusOptions } from "../../data/pqrOptions";
import { PqrChatView } from "../../components/pqr/PqrChatView";
import StatsSummary from "../../components/common/StatsSummary";
import PqrTicketCard from "../../components/pqr/PqrTicketCard";
import ViewToggleButtons from "../../components/common/ViewToggleButtons";

// Página del agente para tomar PQR, responderlas por chat y cambiar su estado y prioridad.
const AgentPqrs = () => {
    const theme = useTheme();
    const filterStyles = getFilterStyles(theme);

    const {
        availablePqrs,
        assignedPqrs,
        filteredPqrs,

        loading,
        error,
        takingPqrId,
        updatingStatusId,
        updatingPriorityId,

        activeView,
        setActiveView,

        statusFilter,
        setStatusFilter,

        priorityFilter,
        setPriorityFilter,

        searchTerm,
        showSearch,
        handleSearchChange,
        toggleSearch,
        clearSearch,

        statusByPqrId,
        priorityByPqrId,

        selectedChatPqrId,
        selectedChatPqr,
        openPqrChat,
        closePqrChat,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAgentPqrs,
        handleTakePqr,
        handleStatusChange,
        handleUpdateStatus,
        handlePriorityChange,
        handleUpdatePriority,
    } = useAgentPqrs();

    // Token obtenido desde el contexto para conectar el chat por Socket.IO.
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

    // Controla el menú desplegable del filtro por estado.
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
        null
    );

    const openFilterMenu = Boolean(filterAnchorEl);

    // Abre el menú de filtros.
    const openFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };
    // Cierra el menú de filtros.
    const closeFilters = () => {
        setFilterAnchorEl(null);
    };

    // Cambia el filtro por estado.
    const handleStatusFilterChange = (event: { target: { value: string } }) => {
        setStatusFilter(event.target.value as "ALL" | PqrStatus);
    };
    // Limpia el filtro por estado.
    const clearStatusFilter = () => {
        setStatusFilter("ALL");
    };
    // Cambia el filtro por prioridad.
    const handlePriorityFilterChange = (event: {
        target: { value: string };
    }) => {
        setPriorityFilter(event.target.value as "ALL" | PqrPriority);
    };

    // Limpia el filtro por prioridad.
    const clearPriorityFilter = () => {
        setPriorityFilter("ALL");
    };

    // Cuenta las PQR asignadas que aún están en seguimiento.
    const pendingAssigned = assignedPqrs.filter(
        (pqr) => pqr.status !== "CERRADA"
    ).length;

    // Cuenta las PQR asignadas que ya fueron cerradas.
    const closedAssigned = assignedPqrs.filter(
        (pqr) => pqr.status === "CERRADA"
    ).length;

    // Datos que se muestran en las tarjetas de resumen superior.
    const summaryItems = [
        {
            label: "Disponibles",
            value: availablePqrs.length,
            icon: <FolderOpenOutlinedIcon fontSize="small" />,
        },
        {
            label: "Asignadas a mí",
            value: assignedPqrs.length,
            icon: <AssignmentOutlinedIcon fontSize="small" />,
        },
        {
            label: "En seguimiento",
            value: pendingAssigned,
            icon: <PendingActionsOutlinedIcon fontSize="small" />,
        },
        {
            label: "Cerradas",
            value: closedAssigned,
            icon: <TaskAltOutlinedIcon fontSize="small" />,
        },
    ];

    // Opciones para cambiar entre PQR disponibles y asignadas.
    const viewOptions = [
        {
            value: "AVAILABLE" as const,
            label: "Disponibles",
            count: availablePqrs.length,
            icon: <FolderOpenOutlinedIcon />,
        },
        {
            value: "ASSIGNED" as const,
            label: "Mis asignadas",
            count: assignedPqrs.length,
            icon: <AssignmentOutlinedIcon />,
        },
    ];

    const style = {
        container: {
            width: "100%",
        },

        topBar: {
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
                xs: "stretch",
                sm: "center",
            },
            flexDirection: {
                xs: "column",
                sm: "row",
            },
            gap: 1.5,
        },

        actionsBox: {
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
            },
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

                {/* Mensajes de éxito, error o advertencia */}
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
                title="PQR del agente"
                subtitle="Consulta las PQR disponibles, toma solicitudes para atenderlas y revisa las PQR asignadas a tu usuario."
            />

            <StatsSummary items={summaryItems} />

            <Box sx={style.topBar}>
                <ViewToggleButtons
                    value={activeView}
                    options={viewOptions}
                    onChange={setActiveView}
                />

                <Box sx={style.actionsBox}>
                    {showSearch ? (
                        <TextField
                            placeholder="Buscar PQR..."
                            value={searchTerm}
                            onChange={handleSearchChange}
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

                    {/* Filtro visual */}
                    <Tooltip title="Filtrar PQR">
                        <IconButton
                            onClick={openFilters}
                            sx={
                                statusFilter !== "ALL" ||
                                    priorityFilter !== "ALL"
                                    ? filterStyles.activeIconButton
                                    : filterStyles.iconButton
                            }
                        >
                            <FilterListOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Actualizar lista">
                        <IconButton
                            onClick={loadAgentPqrs}
                            sx={filterStyles.iconButton}
                        >
                            <RefreshOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

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
                    <Typography variant="body2" sx={filterStyles.filterTitle}>
                        Filtrar PQR
                    </Typography>

                    <Select
                        fullWidth
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        size="small"
                        sx={filterStyles.filterSelect}
                    >
                        <MenuItem value="ALL">Todos los estados</MenuItem>

                        {pqrStatusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        fullWidth
                        value={priorityFilter}
                        onChange={handlePriorityFilterChange}
                        size="small"
                        sx={filterStyles.filterSelect}
                    >
                        <MenuItem value="ALL">Todas las prioridades</MenuItem>

                        {pqrPriorityOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => {
                            clearStatusFilter();
                            clearPriorityFilter();
                        }}
                        disabled={
                            statusFilter === "ALL" && priorityFilter === "ALL"
                        }
                        sx={filterStyles.clearFilterButton}
                    >
                        Limpiar filtros
                    </Button>
                </Box>
            </Menu>

            {/* Mensaje de error al cargar las PQR */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Estado vacío cuando el usuario no tiene PQR */}
            {filteredPqrs.length === 0 ? (
                <EmptyState
                    title="No se encontraron PQR"
                    description={
                        activeView === "AVAILABLE"
                            ? "No hay solicitudes disponibles o no coinciden con los filtros aplicados."
                            : "No tienes solicitudes asignadas o no coinciden con los filtros aplicados."
                    }
                />
            ) : (
                <Box sx={style.list}>
                    {filteredPqrs.map((pqr) => (
                        <PqrTicketCard
                            key={pqr.id}
                            pqr={pqr}
                            activeView={activeView}
                            takingPqrId={takingPqrId}
                            updatingStatusId={updatingStatusId}
                            updatingPriorityId={updatingPriorityId}
                            statusValue={statusByPqrId[pqr.id] || pqr.status}
                            priorityValue={priorityByPqrId[pqr.id] || pqr.priority || ""}
                            onTakePqr={handleTakePqr}
                            onStatusChange={handleStatusChange}
                            onUpdateStatus={handleUpdateStatus}
                            onPriorityChange={handlePriorityChange}
                            onUpdatePriority={handleUpdatePriority}
                            onOpenChat={openPqrChat}
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

export default AgentPqrs;