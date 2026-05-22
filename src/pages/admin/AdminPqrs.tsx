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
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Select,
    Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import { useAdminPqrs } from "../../hooks/useAdminPqrs";
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
import { useState } from "react";
import type { PqrStatus } from "../../interfaces/pqr.interface";
import { getFilterStyles } from "../../styles/filterStyles";
import { pqrStatusOptions } from "../../data/pqrOptions";

// Página administrativa para consultar, responder y cambiar estados de PQR.
const AdminPqrs = () => {
    const theme = useTheme();
    const filterStyles = getFilterStyles(theme);

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

        loadAllPqrs,
        handleStatusChange,
        handleUpdateStatus,
        handleResponseTextChange,
        handleRespondPqr,
    } = useAdminPqrs();

    // Controla el texto escrito en el buscador.
    const [searchTerm, setSearchTerm] = useState("");

    // Controla si el buscador está visible o solo se muestra el ícono.
    const [showSearch, setShowSearch] = useState(false);

    // Controla el filtro por estado de la PQR.
    const [statusFilter, setStatusFilter] = useState<"ALL" | PqrStatus>("ALL");

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
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

    // Indica si el menú de filtros está abierto.
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
    const openFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    // Cierra el menú de filtros.
    const closeFilters = () => {
        setFilterAnchorEl(null);
    };

    // Limpia todos los filtros aplicados.
    const clearFilters = () => {
        setStatusFilter("ALL");
        setAgentFilter("ALL");
        setStartDateFilter("");
        setEndDateFilter("");
    };

    // Verifica si existe algún filtro activo.
    const hasActiveFilters =
        statusFilter !== "ALL" ||
        caseTypeFilter !== "ALL" ||
        agentFilter !== "ALL" ||
        startDateFilter !== "" ||
        endDateFilter !== "";

    // Opciones únicas de tipo de caso tomadas desde las PQR cargadas.
    // Esto evita escribir manualmente los tipos y se adapta a los datos reales.
    const caseTypeOptions = Array.from(
        new Set(pqrs.map((pqr) => pqr.caseType))
    );

    // Lista de PQR filtradas según búsqueda, estado, agente asignado y rango de fecha.
    const filteredPqrs = pqrs.filter((pqr) => {
        // Normaliza el texto buscado para comparar sin importar mayúsculas o espacios.
        const normalizedSearch = searchTerm.toLowerCase().trim();

        // Valida si la PQR coincide con el texto escrito en el buscador.
        // Busca en descripción, tipo de caso, estado, solicitante y agente asignado.
        const matchesSearch =
            !normalizedSearch ||
            pqr.description.toLowerCase().includes(normalizedSearch) ||
            pqr.caseType.toLowerCase().includes(normalizedSearch) ||
            pqr.status.toLowerCase().includes(normalizedSearch) ||
            pqr.user?.name?.toLowerCase().includes(normalizedSearch) ||
            pqr.user?.email?.toLowerCase().includes(normalizedSearch) ||
            pqr.assignedTo?.name?.toLowerCase().includes(normalizedSearch) ||
            pqr.assignedTo?.email?.toLowerCase().includes(normalizedSearch);

        // Valida si la PQR coincide con el estado seleccionado.
        const matchesStatus =
            statusFilter === "ALL" || pqr.status === statusFilter;

        // Valida si la PQR coincide con el tipo de caso seleccionado.
        const matchesCaseType =
            caseTypeFilter === "ALL" || pqr.caseType === caseTypeFilter;

        // Valida si la PQR cumple con el filtro de agente asignado.
        const matchesAgent =
            agentFilter === "ALL" ||
            (agentFilter === "WITH_AGENT" && !!pqr.assignedTo) ||
            (agentFilter === "WITHOUT_AGENT" && !pqr.assignedTo);

        // Convierte la fecha de creación de la PQR para compararla con el rango seleccionado.
        const createdDate = new Date(pqr.createdAt);

        // Crea la fecha inicial en horario local desde las 00:00:00.
        // Esto permite que al seleccionar una fecha inicial filtre desde ese día completo.
        const startDate = startDateFilter
            ? new Date(`${startDateFilter}T00:00:00`)
            : null;

        // Crea la fecha final en horario local hasta las 23:59:59.999.
        // Esto permite incluir todas las PQR creadas durante la fecha final seleccionada.
        const endDate = endDateFilter
            ? new Date(`${endDateFilter}T23:59:59.999`)
            : null;

        // Si existe fecha inicial, muestra solo PQR creadas desde esa fecha en adelante.
        const matchesStartDate = !startDate || createdDate >= startDate;

        // Si existe fecha final, muestra solo PQR creadas hasta esa fecha incluida.
        const matchesEndDate = !endDate || createdDate <= endDate;

        // La PQR solo se muestra si cumple todas las condiciones.
        return (
            matchesSearch &&
            matchesStatus &&
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
                actions={
                    <>
                        {/* Buscador desplegable para filtrar PQR por texto. */}
                        {showSearch ? (
                            <TextField
                                placeholder="Buscar PQR..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
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
                                    sx={searchTerm ? filterStyles.activeIconButton : filterStyles.iconButton}
                                >
                                    <SearchOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Botón que abre el menú de filtros. */}
                        <Tooltip title="Filtrar PQR">
                            <IconButton
                                onClick={openFilters}
                                sx={hasActiveFilters ? filterStyles.activeIconButton : filterStyles.iconButton}
                            >
                                <FilterListOutlinedIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Menú desplegable con filtros por estado, agente y fecha. */}
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
                                    Filtros de PQR
                                </Typography>

                                {/* Filtro por estado de la PQR. */}
                                <Select
                                    fullWidth
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value as "ALL" | PqrStatus)
                                    }
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

                                {/* Filtro por tipo de caso de la PQR. */}
                                <Select
                                    fullWidth
                                    value={caseTypeFilter}
                                    onChange={(event) =>
                                        setCaseTypeFilter(event.target.value)
                                    }
                                    size="small"
                                    sx={filterStyles.filterSelect}
                                >
                                    <MenuItem value="ALL">Todos los tipos de caso</MenuItem>

                                    {caseTypeOptions.map((caseType) => (
                                        <MenuItem key={caseType} value={caseType}>
                                            {getCaseTypeLabel(caseType)}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {/* Filtro por agente asignado. */}
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
                                    <MenuItem value="ALL">Todas las PQR</MenuItem>
                                    <MenuItem value="WITH_AGENT">Con agente asignado</MenuItem>
                                    <MenuItem value="WITHOUT_AGENT">Sin agente asignado</MenuItem>
                                </Select>

                                {/* Filtro por rango de fecha de creación. */}
                                <Box sx={filterStyles.filterDateRow}>
                                    <TextField
                                        label="Desde"
                                        type="date"
                                        value={startDateFilter}
                                        onChange={(event) =>
                                            setStartDateFilter(event.target.value)
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
                                            setEndDateFilter(event.target.value)
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

                                {/* Limpia todos los filtros aplicados. */}
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

                        {/* Recarga la lista de PQR desde el backend. */}
                        <Tooltip title="Actualizar lista">
                            <IconButton onClick={loadAllPqrs} sx={filterStyles.iconButton}>
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
                    {filteredPqrs.map((pqr) => {
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