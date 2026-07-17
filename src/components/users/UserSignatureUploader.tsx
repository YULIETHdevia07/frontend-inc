import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { useUserSignature } from "../../hooks/users/useUserSignature";

// Componente para subir la firma del usuario autenticado.
const UserSignatureUploader = () => {
    const {
        selectedFile,
        previewUrl,
        loading,
        message,
        error,

        handleFileChange,
        handleUploadSignature,
    } = useUserSignature();

    // Captura la imagen seleccionada.
    const onFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] || null;

        handleFileChange(file);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Firma del usuario
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            mt: 0.5,
                        }}
                    >
                        Sube una imagen clara de tu firma. Esta se usará en las
                        aprobaciones de requisiciones.
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {message && (
                    <Alert severity="success">
                        {message}
                    </Alert>
                )}

                {previewUrl && (
                    <Box
                        sx={{
                            p: 2,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                            textAlign: "center",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: "text.secondary",
                            }}
                        >
                            Vista previa de la firma
                        </Typography>

                        <Box
                            component="img"
                            src={previewUrl}
                            alt="Vista previa de la firma"
                            sx={{
                                maxWidth: "260px",
                                maxHeight: "120px",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                )}

                {selectedFile && (
                    <Typography variant="body2">
                        Archivo seleccionado: {selectedFile.name}
                    </Typography>
                )}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1.5}
                >
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileOutlinedIcon />}
                        disabled={loading}
                    >
                        Seleccionar firma
                        <input
                            hidden
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={onFileChange}
                        />
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        disabled={loading || !selectedFile}
                        onClick={handleUploadSignature}
                    >
                        {loading ? "Guardando..." : "Guardar firma"}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default UserSignatureUploader;