import { useState } from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
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

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import type { PqrStatus } from "../../interfaces/pqr.interface";

import { useAgentPqrs } from "../../hooks/useAgentPqrs";
import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
    pqrStatusOptions,
} from "../../utils/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";

// Página del agente para tomar PQR, responderlas y cambiar su estado.
const AgentPqrs = () => {
    const theme = useTheme();

    const {
        availablePqrs,
        assignedPqrs,
        filteredPqrs,

        loading,
        takingPqrId,
        updatingStatusId,
        respondingPqrId,

        activeView,
        setActiveView,

        statusFilter,
        setStatusFilter,

        searchTerm,
        showSearch,
        handleSearchChange,
        toggleSearch,
        clearSearch,

        statusByPqrId,
        responseTexts,
        responseErrors,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAgentPqrs,
        handleTakePqr,
        handleStatusChange,
        handleUpdateStatus,
        handleResponseChange,
        handleRespondPqr,
    } = useAgentPqrs();

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

    const style = {
        container: {
            width: "100%",
        },

        viewButtonsContainer: {
            mb: 3,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
        },

        searchInput: {
            width: {
                xs: "100%",
                sm: "280px",
            },
            "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: theme.palette.background.paper,
            },
        },

        iconButton: {
            borderRadius: "12px",
            backgroundColor: "#f1f5f9",
            color: "#334155",
            "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
            },
        },

        activeIconButton: {
            borderRadius: "12px",
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            "&:hover": {
                backgroundColor: theme.palette.primary.light,
            },
        },

        filterMenuPaper: {
            width: 240,
            padding: "8px",
            borderRadius: "14px",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.14)",
        },

        filterMenuContent: {
            padding: "8px",
        },

        filterTitle: {
            fontWeight: 800,
            marginBottom: "8px",
            color: theme.palette.text.primary,
        },

        filterSelect: {
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
        },

        list: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },

        card: {
            p: {
                xs: 2,
                md: 3,
            },
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

        assignedActions: {
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

        responseForm: {
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

        select: {
            borderRadius: "12px",
            backgroundColor: theme.palette.background.paper,
        },

        responseInput: {
            "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: theme.palette.background.paper,
            },
        },

        helperError: {
            mt: 0.8,
            color: theme.palette.error.main,
            fontSize: "0.82rem",
        },

        button: {
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
            textTransform: "none",
        },

        clearFilterButton: {
            marginTop: "8px",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
        },
    };

    if (loading) {
        return <LoadingBox />;
    }

    return (
        <Box sx={style.container}>
            <PageHeader
                title="PQR del agente"
                subtitle="Consulta las PQR disponibles, toma solicitudes para atenderlas y revisa las PQR asignadas a tu usuario."
                actions={
                    <>
                        {/* Buscador desplegable */}
                        {showSearch ? (
                            <TextField
                                placeholder="Buscar PQR..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                size="small"
                                autoFocus
                                sx={style.searchInput}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlinedIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={clearSearch}>
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
                                    sx={searchTerm ? style.activeIconButton : style.iconButton}
                                >
                                    <SearchOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Filtro visual */}
                        <Tooltip title="Filtrar por estado">
                            <IconButton
                                onClick={openFilters}
                                sx={
                                    statusFilter !== "ALL"
                                        ? style.activeIconButton
                                        : style.iconButton
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
                                    sx: style.filterMenuPaper,
                                },
                            }}
                        >
                            <Box sx={style.filterMenuContent}>
                                <Typography variant="body2" sx={style.filterTitle}>
                                    Filtrar por estado
                                </Typography>

                                <Select
                                    fullWidth
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    size="small"
                                    sx={style.filterSelect}
                                >
                                    <MenuItem value="ALL">Todos los estados</MenuItem>

                                    {pqrStatusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={clearStatusFilter}
                                    disabled={statusFilter === "ALL"}
                                    sx={style.clearFilterButton}
                                >
                                    Limpiar filtro
                                </Button>
                            </Box>
                        </Menu>

                        {/* Recarga las listas de PQR */}
                        <Tooltip title="Actualizar lista">
                            <IconButton onClick={loadAgentPqrs} sx={style.iconButton}>
                                <RefreshOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                }
            />

            {/* Botones para cambiar entre PQR disponibles y asignadas */}
            <Box sx={style.viewButtonsContainer}>
                <Button
                    variant={activeView === "AVAILABLE" ? "contained" : "outlined"}
                    startIcon={<FolderOpenOutlinedIcon />}
                    onClick={() => setActiveView("AVAILABLE")}
                    sx={style.button}
                >
                    Disponibles ({availablePqrs.length})
                </Button>

                <Button
                    variant={activeView === "ASSIGNED" ? "contained" : "outlined"}
                    startIcon={<AssignmentOutlinedIcon />}
                    onClick={() => setActiveView("ASSIGNED")}
                    sx={style.button}
                >
                    Mis asignadas ({assignedPqrs.length})
                </Button>
            </Box>

            {/* Estado vacío cuando no hay resultados */}
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
                        <Paper key={pqr.id} sx={style.card}>
                            <Box sx={style.cardHeader}>
                                <Box>
                                    <Typography variant="h6" sx={style.cardTitle}>
                                        {getCaseTypeLabel(pqr.caseType)}
                                    </Typography>

                                    <Typography sx={style.date}>
                                        Creada el {formatDate(pqr.createdAt)}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={
                                        pqrStatusOptions.find(
                                            (option) => option.value === pqr.status
                                        )?.label || pqr.status
                                    }
                                    color={getStatusColor(pqr.status)}
                                    size="small"
                                />
                            </Box>

                            <Typography sx={style.description}>
                                {pqr.description}
                            </Typography>

                            {/* Información del usuario solicitante */}
                            <Box sx={style.userBox}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    Usuario solicitante
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {pqr.user?.name || "Usuario no disponible"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {pqr.user?.email || "Correo no disponible"}
                                </Typography>
                            </Box>

                            {/* Muestra la respuesta actual si la PQR ya fue respondida */}
                            {activeView === "ASSIGNED" && pqr.response && (
                                <Box sx={style.responseBox}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Respuesta actual
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {pqr.response}
                                    </Typography>
                                </Box>
                            )}

                            {/* Acciones disponibles solo para PQR asignadas */}
                            {activeView === "ASSIGNED" && (
                                <Box sx={style.assignedActions}>
                                    <Box sx={style.statusBox}>
                                        <Typography variant="body2" sx={style.fieldLabel}>
                                            Cambiar estado
                                        </Typography>

                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={statusByPqrId[pqr.id] || pqr.status}
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        pqr.id,
                                                        event.target.value as PqrStatus
                                                    )
                                                }
                                                sx={style.select}
                                            >
                                                {pqrStatusOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            disabled={updatingStatusId === pqr.id}
                                            onClick={() => handleUpdateStatus(pqr.id)}
                                            sx={{
                                                ...style.button,
                                                mt: 1.5,
                                            }}
                                        >
                                            {updatingStatusId === pqr.id ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                "Guardar estado"
                                            )}
                                        </Button>
                                    </Box>

                                    <Box sx={style.responseForm}>
                                        <Typography variant="body2" sx={style.fieldLabel}>
                                            Responder PQR
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            placeholder="Escribe la respuesta para el usuario..."
                                            value={responseTexts[pqr.id] || ""}
                                            onChange={(event) =>
                                                handleResponseChange(pqr.id, event.target.value)
                                            }
                                            sx={style.responseInput}
                                        />

                                        {responseErrors[pqr.id] && (
                                            <Typography sx={style.helperError}>
                                                {responseErrors[pqr.id]}
                                            </Typography>
                                        )}

                                        <Button
                                            variant="contained"
                                            disabled={respondingPqrId === pqr.id}
                                            onClick={() => handleRespondPqr(pqr.id)}
                                            sx={{
                                                ...style.button,
                                                mt: 1.5,
                                            }}
                                        >
                                            {respondingPqrId === pqr.id ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                "Enviar respuesta"
                                            )}
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {/* Acción disponible solo para PQR disponibles */}
                            {activeView === "AVAILABLE" && (
                                <Box sx={style.actionsBox}>
                                    <Button
                                        variant="contained"
                                        startIcon={
                                            takingPqrId === pqr.id ? (
                                                <CircularProgress size={18} color="inherit" />
                                            ) : (
                                                <AssignmentTurnedInOutlinedIcon />
                                            )
                                        }
                                        disabled={takingPqrId === pqr.id}
                                        onClick={() => handleTakePqr(pqr.id)}
                                        sx={style.button}
                                    >
                                        Tomar PQR
                                    </Button>
                                </Box>
                            )}
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

export default AgentPqrs;