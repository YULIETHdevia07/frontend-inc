import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Rating,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

import { useMyPqrs } from "../../hooks/useMyPqrs";
import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import { pqrStatusOptions } from "../../data/pqrOptions";

// Página donde el usuario consulta las PQR que ha creado.
const MyPqrs = () => {
    const theme = useTheme();

    const {
        pqrs,
        loading,
        error,

        ratingPqrId,
        rating,
        ratingComment,
        ratingLoading,

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
    border: `1px solid ${theme.palette.primary.light}`,
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
    },
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

  description: {
    color: theme.palette.text.secondary,
    mt: 1,
    lineHeight: 1.7,
  },

  responseBox: {
    mt: 2.5,
    p: 2,
    borderRadius: 3,
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

  date: {
    mt: 1,
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
  },

  ratingButton: {
    mt: 2,
    borderRadius: 3,
    fontWeight: 800,
    textTransform: "none",
    boxShadow: "none",
  },

  ratingSection: {
    mt: 2.5,
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
    color: theme.palette.primary.main
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

  ratedBox: {
            mt: 2.5,
            p: 2,
            borderRadius: 4,
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
        },

        ratedTitle: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 800,
            mb: 1,
            color: "#9a3412",
        },

        ratedComment: {
            mt: 1,
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
        },

        ratedDate: {
            display: "block",
            mt: 0.8,
            color: theme.palette.text.secondary,
        },
};

    if (loading) {
        return <LoadingBox />;
    }

    return (
        <Box sx={style.container}>
            <PageHeader
                title="Mis PQR"
                subtitle="Consulta el estado de tus peticiones, quejas, reclamos o solicitudes."
            />

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
                                        sx={{ fontWeight: 700 }}
                                    />
                                </Box>

                                <Divider />

                                <Typography variant="body2" sx={style.description}>
                                    {pqr.description}
                                </Typography>

                                {/* Respuesta registrada por ADMIN o AGENT */}
                                {pqr.response && (
                                    <Box sx={style.responseBox}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={style.responseTitle}
                                        >
                                            <QuestionAnswerOutlinedIcon fontSize="small" />
                                            Respuesta recibida
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {pqr.response}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Calificación ya registrada */}
                                {pqr.rating && (
                                    <Box sx={style.ratedBox}>
                                        <Typography variant="subtitle2" sx={style.ratedTitle}>
                                            Calificación registrada
                                        </Typography>

                                        <Rating value={pqr.rating} readOnly size="small" />

                                        {pqr.ratingComment && (
                                            <Typography variant="body2" sx={style.ratedComment}>
                                                {pqr.ratingComment}
                                            </Typography>
                                        )}

                                        {pqr.ratedAt && (
                                            <Typography variant="caption" sx={style.ratedDate}>
                                                Calificada el {formatDate(pqr.ratedAt)}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Botón para abrir formulario de calificación */}
                                {pqr.status === "CERRADA" &&
                                    !pqr.rating &&
                                    ratingPqrId !== pqr.id && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<RateReviewOutlinedIcon />}
                                            sx={style.ratingButton}
                                            onClick={() => openRatingForm(pqr.id)}
                                        >
                                            Calificar atención
                                        </Button>
                                    )}

                                {/* Formulario de calificación dentro de la tarjeta */}
                                {ratingPqrId === pqr.id && (
                                    <Box sx={style.ratingSection}>
                                        <Typography variant="subtitle1" sx={style.ratingHeader}>
                                            <RateReviewOutlinedIcon fontSize="small" />
                                            Califica la atención recibida
                                        </Typography>

                                        <Typography variant="body2" sx={style.ratingDescription}>
                                            Selecciona una valoración y escribe un comentario si
                                            deseas aportar más detalles sobre la atención brindada.
                                        </Typography>

                                        <Box sx={style.ratingStarsBox}>
                                            <Rating
                                                value={rating}
                                                onChange={(_, value) => setRating(value)}
                                                size="large"
                                            />

                                            <Typography variant="body2" sx={style.ratingText}>
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
                                            onChange={(event) => setRatingComment(event.target.value)}
                                            slotProps={{
                                                htmlInput: {
                                                    maxLength: 300,
                                                },
                                            }}
                                            helperText={`${300 - ratingComment.length} caracteres disponibles`}
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
                                                onClick={() => submitRating(pqr.id)}
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
                            </Paper>
                        );
                    })}
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