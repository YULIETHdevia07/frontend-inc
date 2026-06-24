import { useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import type { BulkUploadDialogProps } from "../../interfaces/users/bulkUpload.interface";

// Componente reutilizable para cargas masivas con archivo Excel.
const BulkUploadDialog = <T,>({
    open,
    title,
    description,
    requiredColumns,
    file,
    loading,
    completed = false,
    result,
    onClose,
    onFileChange,
    onUpload,
    onClearResult,
    onDownloadTemplate,
}: BulkUploadDialogProps<T>) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;

        onFileChange(selectedFile);

        if (onClearResult) {
            onClearResult();
        }

        // Permite volver a seleccionar el mismo archivo varias veces.
        event.target.value = "";
    };

    const handleOpenFileSelector = () => {
        if (loading) return;

        fileInputRef.current?.click();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (loading) return;

        const selectedFile = event.dataTransfer.files?.[0] ?? null;

        if (!selectedFile) return;

        onFileChange(selectedFile);

        if (onClearResult) {
            onClearResult();
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const hasErrors = Boolean(result && result.totalErrors > 0);
    const hasSuccess = Boolean(result && result.totalErrors === 0);
    const hasResult = Boolean(result);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle
                sx={{
                    px: 3,
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary",
                        }}
                    >
                        {title}
                    </Typography>

                    <IconButton
                        onClick={onClose}
                        disabled={loading}
                        size="small"
                        sx={{
                            color: "text.secondary",
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "background.default",
                                color: "text.primary",
                            },
                        }}
                    >
                        <CloseOutlinedIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pt: 3.5, pb: 2.5 }}>
                {onDownloadTemplate && (
                    <Box sx={{ mb: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onDownloadTemplate}
                            disabled={loading}
                            startIcon={<DownloadOutlinedIcon />}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                color: "text.primary",
                                borderColor: "divider",
                                backgroundColor: "background.paper",
                                px: 1.8,
                                py: 0.8,
                                "&:hover": {
                                    borderColor: "primary.main",
                                    backgroundColor: "primary.light",
                                },
                            }}
                        >
                            Descargar plantilla
                        </Button>
                    </Box>
                )}

                <Box
                    onClick={handleOpenFileSelector}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 130,
                        mb: 2,
                        border: "1px dashed",
                        borderColor: file ? "primary.main" : "text.secondary",
                        borderRadius: 2.5,
                        cursor: loading ? "default" : "pointer",
                        backgroundColor: file ? "primary.light" : "background.paper",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "primary.light",
                        },
                    }}
                >
                    <input
                        ref={fileInputRef}
                        key={file ? file.name : "empty-file"}
                        hidden
                        type="file"
                        accept=".xlsx,.xls"
                        disabled={loading}
                        onChange={handleFileChange}
                    />

                    <FileUploadOutlinedIcon
                        sx={{
                            mb: 1,
                            color: "text.primary",
                            fontSize: 30,
                        }}
                    />

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            textAlign: "center",
                        }}
                    >
                        {file
                            ? file.name
                            : "Arrastra el archivo o haz clic para seleccionarlo"}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            color: "text.secondary",
                        }}
                    >
                        Formatos permitidos: .xls y .xlsx
                    </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 2 }}>
                    Columnas requeridas:{" "}
                    <strong>{requiredColumns.join(" | ")}</strong>
                </Alert>

                <Box
                    sx={{
                        minHeight: 250,
                        maxHeight: 360,
                        overflowY: "auto",
                        borderRadius: 2,
                        backgroundColor: "#f1f3f6",
                        p: hasResult ? 2 : 0,
                        display: hasResult ? "block" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {!result && (
                        <Box sx={{ textAlign: "center", px: 3 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                    mb: 0.8,
                                }}
                            >
                                Aún no se ha procesado ningún archivo.
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.disabled",
                                    maxWidth: 460,
                                    display: "block",
                                }}
                            >
                                {description}
                            </Typography>
                        </Box>
                    )}

                    {result && (
                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    mb: 2,
                                    flexWrap: "wrap",
                                    rowGap: 1,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 2,
                                    backgroundColor: "#f1f3f6",
                                    py: 1,
                                }}
                            >
                                <Chip
                                    label={`Filas leídas: ${result.totalRows}`}
                                    sx={{
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        backgroundColor: "#e5e7eb",
                                        color: "text.primary",
                                    }}
                                />

                                <Chip
                                    label={`Usuarios creados: ${result.totalCreated}`}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        color: "success.main",
                                        borderColor: "success.main",
                                        backgroundColor: "#e8f5e9",
                                    }}
                                />

                                <Chip
                                    label={`Filas con errores: ${result.totalRowsWithErrors}`}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        color: hasErrors ? "warning.main" : "text.secondary",
                                        borderColor: hasErrors ? "warning.main" : "divider",
                                        backgroundColor: hasErrors ? "#fff8e1" : "#f5f5f5",
                                    }}
                                />

                                <Chip
                                    label={`Errores encontrados: ${result.totalErrors}`}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        color: hasErrors ? "error.main" : "text.secondary",
                                        borderColor: hasErrors ? "error.main" : "divider",
                                        backgroundColor: hasErrors ? "#ffebee" : "#f5f5f5",
                                    }}
                                />
                            </Stack>

                            {hasSuccess && (
                                <Alert
                                    severity="success"
                                    icon={<CheckCircleOutlineOutlinedIcon />}
                                    sx={{ mb: 2 }}
                                >
                                    {result.message || "La carga masiva se procesó correctamente."}
                                </Alert>
                            )}

                            {hasErrors && (
                                <Alert
                                    severity="warning"
                                    icon={<ErrorOutlineOutlinedIcon />}
                                    sx={{ mb: 2 }}
                                >
                                    {result.message ||
                                        "El archivo contiene errores. Revisa las filas señaladas."}
                                </Alert>
                            )}

                            {result.errors.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 700,
                                            color: "text.primary",
                                        }}
                                    >
                                        Detalle de errores encontrados
                                    </Typography>

                                    <Box
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            backgroundColor: "background.paper",
                                        }}
                                    >
                                        {result.errors.map((rowError) => (
                                            <Accordion
                                                key={rowError.row}
                                                disableGutters
                                                sx={{
                                                    boxShadow: "none",
                                                    borderBottom: "1px solid",
                                                    borderColor: "divider",
                                                    "&::before": {
                                                        display: "none",
                                                    },
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreOutlinedIcon />}
                                                    sx={{
                                                        backgroundColor: "background.default",
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        sx={{
                                                            width: "100%",
                                                            flexWrap: "wrap",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 700 }}
                                                        >
                                                            Fila {rowError.row}
                                                        </Typography>

                                                        <Chip
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                            label={`${rowError.totalErrors} error${rowError.totalErrors === 1 ? "" : "es"
                                                                }`}
                                                        />
                                                    </Stack>
                                                </AccordionSummary>

                                                <AccordionDetails>
                                                    <Stack spacing={1}>
                                                        {rowError.errors.map((error, index) => (
                                                            <Box
                                                                key={`${rowError.row}-${error.column}-${index}`}
                                                                sx={{
                                                                    p: 1.5,
                                                                    borderRadius: 2,
                                                                    backgroundColor: "background.default",
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ fontWeight: 700 }}
                                                                >
                                                                    Columna: {error.column}
                                                                </Typography>

                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {error.message}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                    }}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={onUpload}
                    disabled={!file || loading || completed}
                    startIcon={<UploadFileOutlinedIcon />}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        px: 2.5,
                    }}
                >
                    {loading ? "Cargando..." : completed ? "Archivo cargado" : "Subir"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BulkUploadDialog;