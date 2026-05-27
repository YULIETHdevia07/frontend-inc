import { useState } from "react";
import {
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

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

import type { PqrPriority, PqrStatus } from "../../interfaces/pqr.interface";

import { useAgentPqrs } from "../../hooks/useAgentPqrs";
import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import ClearableSelect from "../../components/common/ClearableSelect";
import { getFilterStyles } from "../../styles/filterStyles";
import { pqrPriorityOptions, pqrStatusOptions } from "../../data/pqrOptions";
import PqrRatingSummary from "../../components/pqr/PqrRatingSummary";

// Página del agente para tomar PQR, responderlas y cambiar su estado.
const AgentPqrs = () => {
    const theme = useTheme();
    const filterStyles = getFilterStyles(theme);

    const {
        availablePqrs,
        assignedPqrs,
        filteredPqrs,

        loading,
        takingPqrId,
        updatingStatusId,
        updatingPriorityId,
        respondingPqrId,

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
        handlePriorityChange,
        handleUpdatePriority,
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

    const handlePriorityFilterChange = (event: { target: { value: string } }) => {
        setPriorityFilter(event.target.value as "ALL" | PqrPriority);
    };

    const clearPriorityFilter = () => {
        setPriorityFilter("ALL");
    };

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
                md: "row",
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

        statusChip: {
            borderRadius: "999px",
            fontWeight: 800,
            px: 0.5,
            maxWidth: "100%",
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
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
        },

        simpleActions: {
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "220px 220px 1fr",
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

        responseForm: {
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary.light}`,
            gridColumn: {
                xs: "1 / -1",
                lg: "auto",
            },
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

        button: {
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
                                    sx={searchTerm ? filterStyles.activeIconButton : filterStyles.iconButton}
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
                                    statusFilter !== "ALL" || priorityFilter !== "ALL"
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
                                    disabled={statusFilter === "ALL" && priorityFilter === "ALL"}
                                    sx={filterStyles.clearFilterButton}
                                >
                                    Limpiar filtros
                                </Button>
                            </Box>
                        </Menu>

                        {/* Recarga las listas de PQR */}
                        <Tooltip title="Actualizar lista">
                            <IconButton
                                onClick={loadAgentPqrs}
                                sx={filterStyles.iconButton}
                            >
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
                                <Box sx={style.cardTitleBox}>
                                    <Typography variant="h6" sx={style.cardTitle}>
                                        {getCaseTypeLabel(pqr.caseType)}
                                    </Typography>

                                    <Box sx={style.dateBox}>
                                        <CalendarMonthOutlinedIcon fontSize="small" />
                                        <Typography variant="body2" sx={style.date}>
                                            Creada: {formatDate(pqr.createdAt)}
                                        </Typography>
                                    </Box>

                                    <Box sx={style.dateBox}>
                                        <PersonOutlineOutlinedIcon fontSize="small" />
                                        <Typography variant="body2" sx={style.date}>
                                            Usuario: {pqr.user?.name || "No disponible"} ·{" "}
                                            {pqr.user?.email || "No disponible"}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={style.chipColumn}>
                                    {pqr.priority && (
                                        <Box sx={style.priorityChipBox}>
                                            <Chip
                                                icon={<FlagOutlinedIcon />}
                                                label={`Prioridad: ${getPriorityLabel(pqr.priority)}`}
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

                            <Typography sx={style.description}>
                                {pqr.description}
                            </Typography>

                            {/* Muestra la respuesta actual si la PQR ya fue respondida */}
                            {activeView === "ASSIGNED" && pqr.response && (
                                <Box sx={style.responseBox}>
                                    <Typography variant="subtitle2" sx={style.responseTitle}>
                                        <QuestionAnswerOutlinedIcon fontSize="small" />
                                        Respuesta actual
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {pqr.response}
                                    </Typography>
                                </Box>
                            )}

                            {/* Muestra la calificación registrada por el usuario */}
                            {pqr.rating !== null &&
                                pqr.rating !== undefined && (
                                    <PqrRatingSummary
                                        rating={pqr.rating}
                                        ratingComment={pqr.ratingComment}
                                        ratedAt={pqr.ratedAt}
                                    />
                                )}

                            {/* Acciones disponibles solo para PQR asignadas */}
                            {activeView === "ASSIGNED" && (
                                <Box sx={style.simpleActions}>
                                    <Box sx={style.simpleBox}>
                                        <Typography sx={style.simpleLabel}>
                                            Estado
                                        </Typography>

                                        <ClearableSelect
                                            label="Cambiar estado"
                                            value={
                                                statusByPqrId[pqr.id] ||
                                                pqr.status
                                            }
                                            disabled={
                                                pqr.status === "CERRADA"
                                            }
                                            required
                                            size="small"
                                            minWidth="100%"
                                            options={pqrStatusOptions}
                                            onChange={(value) =>
                                                handleStatusChange(
                                                    pqr.id,
                                                    value as PqrStatus
                                                )
                                            }
                                        />

                                        <Button
                                            variant="contained"
                                            disabled={
                                                updatingStatusId === pqr.id ||
                                                pqr.status === "CERRADA"
                                            }
                                            onClick={() =>
                                                handleUpdateStatus(pqr.id)
                                            }
                                            sx={style.simpleButton}
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
                                                priorityByPqrId[pqr.id] ||
                                                pqr.priority
                                            }
                                            disabled={
                                                pqr.status === "CERRADA"
                                            }
                                            required
                                            size="small"
                                            minWidth="100%"
                                            options={pqrPriorityOptions}
                                            onChange={(value) =>
                                                handlePriorityChange(
                                                    pqr.id,
                                                    value as PqrPriority
                                                )
                                            }
                                        />

                                        <Button
                                            variant="contained"
                                            disabled={
                                                updatingPriorityId === pqr.id ||
                                                pqr.status === "CERRADA"
                                            }
                                            onClick={() =>
                                                handleUpdatePriority(pqr.id)
                                            }
                                            sx={style.simpleButton}
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

                                    <Box sx={style.responseForm}>
                                        <TextField
                                            label="Responder PQR"
                                            placeholder="Escribe la respuesta para el usuario..."
                                            value={responseTexts[pqr.id] || ""}
                                            disabled={
                                                pqr.status === "CERRADA"
                                            }
                                            onChange={(event) =>
                                                handleResponseChange(
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
                                            disabled={respondingPqrId === pqr.id || pqr.status == "CERRADA"}
                                            onClick={() => handleRespondPqr(pqr.id)}
                                            startIcon={<SendOutlinedIcon />}
                                            sx={style.responseButton}
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