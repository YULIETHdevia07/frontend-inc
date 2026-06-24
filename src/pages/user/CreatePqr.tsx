import {
    Alert,
    Box,
    Button,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import { useCreatePqr } from "../../hooks/pqrs/useCreatePqr";
import { pqrCaseTypes } from "../../data/pqrOptions";
import { formatFileSize } from "../../utils/common/fileUtils";

import ClearableSelect from "../../components/common/ClearableSelect";
import CustomSnackbar from "../../components/common/CustomSnackbar";

// Página donde el usuario crea una nueva PQR.
const CreatePqr = () => {
    const theme = useTheme();

    const {
        caseType,
        description,
        selectedFile,

        message,
        openMessage,
        error,
        formErrors,

        handleCaseTypeChange,
        handleDescriptionChange,
        handleFileChange,
        handleRemoveFile,
        handleCreatePqr,
        closeMessage,
    } = useCreatePqr();

    const style = {
        container: {
            maxWidth: "800px",
            mx: "auto",
        },

        paper: {
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
        },

        title: {
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
        },

        subtitle: {
            color: theme.palette.text.secondary,
            mb: 3,
        },

        form: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },

        attachmentRow: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 1.5,
            py: 1.1,
            borderRadius: 2,
            border: `1px solid ${formErrors.file
                ? theme.palette.error.main
                : theme.palette.divider
                }`,
            backgroundColor: alpha(theme.palette.common.white, 0.02),
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: formErrors.file
                    ? theme.palette.error.main
                    : alpha(theme.palette.primary.main, 0.45),
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
        },

        attachmentLeft: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
        },

        attachmentIcon: {
            color: formErrors.file
                ? theme.palette.error.main
                : theme.palette.text.secondary,
            fontSize: 18,
        },

        attachmentText: {
            fontSize: "0.92rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
        },

        attachmentOptional: {
            fontSize: "0.82rem",
            color: theme.palette.text.secondary,
            flexShrink: 0,
        },

        selectedFileBox: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 1.2,
            py: 1,
            borderRadius: 2,
            border: `1px solid ${formErrors.file
                ? theme.palette.error.main
                : theme.palette.divider
                }`,
            backgroundColor: alpha(theme.palette.common.white, 0.03),
        },

        selectedFileInfo: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
        },

        selectedFileIconBox: {
            width: 32,
            height: 32,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            flexShrink: 0,
        },

        selectedFileTextBox: {
            minWidth: 0,
        },

        selectedFileName: {
            fontSize: "0.85rem",
            fontWeight: 700,
            color: theme.palette.text.primary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: {
                xs: 150,
                sm: 280,
            },
        },

        selectedFileSize: {
            fontSize: "0.72rem",
            color: theme.palette.text.secondary,
            mt: 0.15,
        },

        removeFileButton: {
            color: theme.palette.text.secondary,
            "&:hover": {
                color: theme.palette.error.main,
                backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
        },

        fileErrorText: {
            mt: -1,
            ml: 1.5,
            fontSize: "0.75rem",
            color: theme.palette.error.main,
        },

        submitButton: {
            mt: 0.5,
            py: 1.15,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            boxShadow: "none",
        },
    };

    return (
        <Box sx={style.container}>
            <Paper sx={style.paper}>
                <Typography variant="h5" sx={style.title}>
                    Crear nueva PQR
                </Typography>

                <Typography variant="body2" sx={style.subtitle}>
                    Registra una petición, queja, reclamo o solicitud para que sea
                    atendida.
                </Typography>

                {/* Mensaje para errores generales del backend. */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Formulario de creación de PQR. */}
                <Box component="form" sx={style.form} onSubmit={handleCreatePqr} noValidate>
                    <ClearableSelect
                        label="Tipo de caso"
                        value={caseType}
                        required
                        clearable
                        options={pqrCaseTypes}
                        error={formErrors.caseType}
                        onChange={handleCaseTypeChange}
                    />

                    <TextField
                        label="Descripción"
                        required
                        placeholder="Describe tu solicitud, queja o reclamo"
                        value={description}
                        onChange={(event) =>
                            handleDescriptionChange(event.target.value)
                        }
                        fullWidth
                        multiline
                        minRows={4}
                        slotProps={{
                            htmlInput: {
                                maxLength: 500,
                            },
                        }}
                        error={!!formErrors.description}
                        helperText={
                            formErrors.description
                                ? formErrors.description
                                : `${description.length}/500`
                        }
                    />

                    {!selectedFile ? (
                        <Box component="label" sx={style.attachmentRow}>
                            <input
                                type="file"
                                hidden
                                accept=".jpg,.jpeg,.png,.webp,.pdf"
                                onChange={(event) =>
                                    handleFileChange(
                                        event.target.files?.[0] ?? null
                                    )
                                }
                            />

                            <Box sx={style.attachmentLeft}>
                                <AttachFileOutlinedIcon
                                    sx={style.attachmentIcon}
                                />

                                <Typography sx={style.attachmentText}>
                                    Adjuntar evidencia
                                </Typography>
                            </Box>

                            <Typography sx={style.attachmentOptional}>
                                Opcional
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={style.selectedFileBox}>
                            <Box sx={style.selectedFileInfo}>
                                <Box sx={style.selectedFileIconBox}>
                                    <InsertDriveFileOutlinedIcon
                                        sx={{ fontSize: 18 }}
                                    />
                                </Box>

                                <Box sx={style.selectedFileTextBox}>
                                    <Typography sx={style.selectedFileName}>
                                        {selectedFile.name}
                                    </Typography>

                                    <Typography sx={style.selectedFileSize}>
                                        {formatFileSize(selectedFile.size)}
                                    </Typography>
                                </Box>
                            </Box>

                            <IconButton
                                size="small"
                                onClick={handleRemoveFile}
                                sx={style.removeFileButton}
                                aria-label="Quitar archivo"
                            >
                                <CloseOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    {formErrors.file && (
                        <Typography sx={style.fileErrorText}>
                            {formErrors.file}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        sx={style.submitButton}
                    >
                        Crear PQR
                    </Button>
                </Box>
            </Paper>

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity="success"
                onClose={closeMessage}
            />
        </Box>
    );
};

export default CreatePqr;