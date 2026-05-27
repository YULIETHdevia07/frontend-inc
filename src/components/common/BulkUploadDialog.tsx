import type { ChangeEvent } from "react";
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
    Stack,
    Typography,
} from "@mui/material";

import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import type { BulkUploadDialogProps } from "../../interfaces/bulkUpload.interface";

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
}: BulkUploadDialogProps<T>) => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;

        onFileChange(selectedFile);

        if (onClearResult) {
            onClearResult();
        }
    };

    const hasErrors = Boolean(result && result.totalErrors > 0);
    const hasSuccess = Boolean(result && result.totalErrors === 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontWeight: 700 }}>
                {title}
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                    {description}
                </Typography>

                <Alert severity="info" sx={{ mb: 2 }}>
                    El archivo debe contener las columnas:{" "}
                    <strong>{requiredColumns.join(" | ")}</strong>
                </Alert>

                <Box
                    sx={{
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "background.default",
                    }}
                >
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileOutlinedIcon />}
                        disabled={loading}
                    >
                        Seleccionar archivo
                        <input
                            key={file ? file.name : "empty-file"}
                            hidden
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                        />
                    </Button>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {file ? file.name : "Ningún archivo seleccionado"}
                    </Typography>
                </Box>

                <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 2, color: "text.secondary" }}
                >
                    Solo se permiten archivos Excel con extensión .xlsx o .xls.
                </Typography>

                {result && (
                    <Box sx={{ mt: 3 }}>
                        <Divider sx={{ mb: 2 }} />

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                mb: 2,
                                flexWrap: "wrap",
                                rowGap: 1,
                            }}
                        >
                            <Chip label={`Filas leídas: ${result.totalRows}`} />

                            <Chip
                                label={`Usuarios creados: ${result.totalCreated}`}
                                color="success"
                                variant="outlined"
                            />

                            <Chip
                                label={`Filas con errores: ${result.totalRowsWithErrors}`}
                                color={hasErrors ? "warning" : "default"}
                                variant="outlined"
                            />

                            <Chip
                                label={`Errores encontrados: ${result.totalErrors}`}
                                color={hasErrors ? "error" : "default"}
                                variant="outlined"
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
                                        maxHeight: 320,
                                        overflowY: "auto",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
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
                                                    sx={{ width: "100%", flexWrap: "wrap", alignItems: "center" }}
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
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={onUpload}
                    disabled={!file || loading || completed}
                >
                    {loading ? "Cargando..." : completed ? "Archivo cargado" : "Subir archivo"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BulkUploadDialog;