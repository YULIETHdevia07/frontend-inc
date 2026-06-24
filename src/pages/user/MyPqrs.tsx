import { useState } from "react";
import {
    Alert,
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Rating,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

import type { PqrStatus } from "../../interfaces/pqrs/pqr.interface";

import { useMyPqrs } from "../../hooks/pqrs/useMyPqrs";
import { useAuth } from "../../context/AuthContext";
import { usePqrChat } from "../../hooks/pqrs/usePqrChat";
import { formatDate } from "../../utils/common/dateUtils";
import {
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrs/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import StatsSummary from "../../components/common/StatsSummary";
import { getFilterStyles } from "../../styles/filterStyles";
import { pqrStatusOptions } from "../../data/pqrOptions";
import PqrRatingSummary from "../../components/pqr/PqrRatingSummary";
import { PqrChatView } from "../../components/pqr/PqrChatView";

// Página donde el usuario consulta las PQR que ha creado.
const MyPqrs = () => {
    const theme = useTheme();
    const filterStyles = getFilterStyles(theme);

    const {
        pqrs,
        loading,
        error,
        loadMyPqrs,

        ratingPqrId,
        rating,
        ratingComment,
        ratingLoading,

        selectedChatPqrId,
        selectedChatPqr,
        openPqrChat,
        closePqrChat,

        openMessage,
        message,
        messageType,

        setRating,
        setRatingComment,
        openRatingForm,
        closeRatingForm,
        submitRating,
        closeMessage,
    } = useMyPqrs();

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

    // Controla el texto escrito en el buscador.
    const [searchTerm, setSearchTerm] = useState("");

    // Controla si el buscador está visible.
    const [showSearch, setShowSearch] = useState(false);

    // Controla el filtro por estado.
    const [statusFilter, setStatusFilter] = useState<"ALL" | PqrStatus>("ALL");

    // Controla el menú desplegable de filtros.
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
        null
    );

    const openFilterMenu = Boolean(filterAnchorEl);

    // Muestra el buscador.
    const toggleSearch = () => {
        setShowSearch(true);
    };

    // Limpia el buscador.
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

    // Cambia el filtro por estado.
    const handleStatusFilterChange = (event: { target: { value: string } }) => {
        setStatusFilter(event.target.value as "ALL" | PqrStatus);
    };

    // Limpia el filtro por estado.
    const clearStatusFilter = () => {
        setStatusFilter("ALL");
    };

    const getStatusLabel = (status: PqrStatus) => {
        return (
            pqrStatusOptions.find((option) => option.value === status)?.label ||
            status
        );
    };

    // Cuenta las PQR que aún no están cerradas.
    const pendingPqrs = pqrs.filter((pqr) => pqr.status !== "CERRADA").length;

    // Cuenta las PQR cerradas.
    const closedPqrs = pqrs.filter((pqr) => pqr.status === "CERRADA").length;

    // Cuenta las PQR cerradas que aún no han sido calificadas.
    const pendingRatingPqrs = pqrs.filter(
        (pqr) => pqr.status === "CERRADA" && !pqr.rating
    ).length;

    // Datos que se muestran en las tarjetas de resumen superior.
    const summaryItems = [
        {
            label: "Mis PQR",
            value: pqrs.length,
            icon: <AssignmentOutlinedIcon fontSize="small" />,
        },
        {
            label: "En seguimiento",
            value: pendingPqrs,
            icon: <PendingActionsOutlinedIcon fontSize="small" />,
        },
        {
            label: "Cerradas",
            value: closedPqrs,
            icon: <TaskAltOutlinedIcon fontSize="small" />,
        },
        {
            label: "Por calificar",
            value: pendingRatingPqrs,
            icon: <StarBorderOutlinedIcon fontSize="small" />,
        },
    ];

    // Filtra las PQR por búsqueda y estado.
    const filteredPqrs = pqrs.filter((pqr) => {
        const normalizedSearch = searchTerm.toLowerCase().trim();

        const matchesSearch =
            !normalizedSearch ||
            `${pqr.id}`.includes(normalizedSearch) ||
            `pqr-${pqr.id}`.includes(normalizedSearch) ||
            `#pqr-${pqr.id}`.includes(normalizedSearch) ||
            pqr.description.toLowerCase().includes(normalizedSearch) ||
            pqr.caseType.toLowerCase().includes(normalizedSearch) ||
            getCaseTypeLabel(pqr.caseType)
                .toLowerCase()
                .includes(normalizedSearch) ||
            pqr.status.toLowerCase().includes(normalizedSearch) ||
            getStatusLabel(pqr.status).toLowerCase().includes(normalizedSearch);

        const matchesStatus =
            statusFilter === "ALL" || pqr.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "ALL";

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

        helperText: {
            color: theme.palette.text.secondary,
            fontSize: "0.88rem",
            fontWeight: 600,
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

        statusChip: {
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "0.72rem",
            height: 24,
        },

        dateBox: {
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            color: theme.palette.text.secondary,
            mb: 1.3,
        },

        date: {
            color: theme.palette.text.secondary,
            fontSize: "0.82rem",
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

        actionsBoxCard: {
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
        },

        chatButton: {
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "none",
        },

        ratingButton: {
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "none",
        },

        ratingSection: {
            mt: 1.5,
            p: {
                xs: 1.8,
                md: 2,
            },
            borderRadius: 4,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary.light}`,
        },

        ratingHeader: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
            fontWeight: 800,
            color: theme.palette.primary.main,
        },

        ratingDescription: {
            color: theme.palette.text.secondary,
            mb: 1.5,
            lineHeight: 1.6,
        },

        ratingStarsBox: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
            flexWrap: "wrap",
        },

        ratingText: {
            color: theme.palette.text.secondary,
            fontSize: "0.9rem",
        },

        ratingActions: {
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 1.5,
            flexDirection: {
                xs: "column",
                sm: "row",
            },
        },

        cancelButton: {
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
        },

        submitRatingButton: {
            borderRadius: 3,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "none",
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
                title="Mis PQR"
                subtitle="Consulta el estado de tus peticiones, quejas, reclamos o solicitudes."
            />

            <StatsSummary items={summaryItems} />

            <Box sx={style.topBar}>
                <Typography sx={style.helperText}>
                    {filteredPqrs.length} PQR encontradas
                    {hasActiveFilters && " con filtros aplicados"}
                </Typography>

                <Box sx={style.actionsBox}>
                    {showSearch ? (
                        <TextField
                            placeholder="Buscar..."
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

                    <Tooltip title="Filtrar PQR">
                        <IconButton
                            onClick={openFilters}
                            sx={
                                statusFilter !== "ALL"
                                    ? filterStyles.activeIconButton
                                    : filterStyles.iconButton
                            }
                        >
                            <FilterListOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Actualizar lista">
                        <IconButton
                            onClick={loadMyPqrs}
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
                        Filtrar por estado
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

                    <Button
                        fullWidth
                        variant="text"
                        onClick={clearStatusFilter}
                        disabled={statusFilter === "ALL"}
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
            {pqrs.length === 0 ? (
                <EmptyState
                    title="No tienes PQR registradas"
                    description="Cuando crees una PQR, aparecerá en este espacio."
                />
            ) : filteredPqrs.length === 0 ? (
                <EmptyState
                    title="No se encontraron PQR"
                    description="No hay solicitudes que coincidan con tu búsqueda o filtro aplicado."
                />
            ) : (
                <Box sx={style.list}>
                    {filteredPqrs.map((pqr) => (
                        <Paper key={pqr.id} sx={style.card}>
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

                                    <Chip
                                        label={getStatusLabel(pqr.status)}
                                        color={getStatusColor(pqr.status)}
                                        size="small"
                                        sx={style.statusChip}
                                    />
                                </Box>

                                <Box sx={style.dateBox}>
                                    <CalendarMonthOutlinedIcon fontSize="small" />

                                    <Typography
                                        variant="body2"
                                        sx={style.date}
                                    >
                                        Creada el {formatDate(pqr.createdAt)}
                                    </Typography>
                                </Box>

                                <Box sx={style.descriptionBlock}>
                                    <Typography sx={style.descriptionLabel}>
                                        Descripción
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={style.description}
                                    >
                                        {pqr.description}
                                    </Typography>
                                </Box>

                                {/* Calificación ya registrada */}
                                {pqr.rating && (
                                    <PqrRatingSummary
                                        rating={pqr.rating}
                                        ratingComment={pqr?.ratingComment}
                                        ratedAt={pqr.ratedAt}
                                    />
                                )}

                                <Divider sx={{ mt: 1.5 }} />

                                <Box sx={style.actionsBoxCard}>
                                    {/* Botón para abrir el chat de seguimiento */}
                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            <Badge
                                                badgeContent={pqr.unreadMessagesCount ?? 0}
                                                color="error"
                                                invisible={(pqr.unreadMessagesCount ?? 0) === 0}
                                            >
                                                <ForumOutlinedIcon />
                                            </Badge>
                                        }
                                        sx={style.chatButton}
                                        onClick={() => openPqrChat(pqr.id)}
                                    >
                                        Ver chat
                                    </Button>

                                    {/* Botón para abrir formulario de calificación */}
                                    {pqr.status === "CERRADA" &&
                                        !pqr.rating &&
                                        ratingPqrId !== pqr.id && (
                                            <Button
                                                variant="outlined"
                                                startIcon={
                                                    <RateReviewOutlinedIcon />
                                                }
                                                sx={style.ratingButton}
                                                onClick={() =>
                                                    openRatingForm(pqr.id)
                                                }
                                            >
                                                Calificar atención
                                            </Button>
                                        )}
                                </Box>

                                {/* Formulario de calificación dentro de la tarjeta */}
                                {ratingPqrId === pqr.id && (
                                    <Box sx={style.ratingSection}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={style.ratingHeader}
                                        >
                                            <RateReviewOutlinedIcon fontSize="small" />
                                            Califica la atención recibida
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={style.ratingDescription}
                                        >
                                            Selecciona una valoración y escribe
                                            un comentario si deseas aportar más
                                            detalles sobre la atención brindada.
                                        </Typography>

                                        <Box sx={style.ratingStarsBox}>
                                            <Rating
                                                value={rating}
                                                onChange={(_, value) =>
                                                    setRating(value)
                                                }
                                                size="large"
                                            />

                                            <Typography
                                                variant="body2"
                                                sx={style.ratingText}
                                            >
                                                {rating
                                                    ? `${rating} de 5 estrellas`
                                                    : "Sin calificación seleccionada"}
                                            </Typography>
                                        </Box>

                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            label="Comentario"
                                            placeholder="Ejemplo: La atención fue clara y oportuna."
                                            value={ratingComment}
                                            onChange={(event) =>
                                                setRatingComment(
                                                    event.target.value
                                                )
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    maxLength: 300,
                                                },
                                            }}
                                            helperText={`${300 - ratingComment.length
                                                } caracteres disponibles`}
                                        />

                                        <Box sx={style.ratingActions}>
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                onClick={closeRatingForm}
                                                disabled={ratingLoading}
                                                sx={style.cancelButton}
                                            >
                                                Cancelar
                                            </Button>

                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    submitRating(pqr.id)
                                                }
                                                disabled={ratingLoading}
                                                sx={style.submitRatingButton}
                                            >
                                                {ratingLoading
                                                    ? "Enviando..."
                                                    : "Enviar calificación"}
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity={messageType}
                onClose={closeMessage}
            />
        </Box>
    );
};

export default MyPqrs;