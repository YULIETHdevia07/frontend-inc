import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import type { ReactNode } from "react";

import ActionButton from "./ActionButton";

type ConfirmActionType =
    | "approve"
    | "reject"
    | "cancel"
    | "delete"
    | "save"
    | "custom";

interface ConfirmActionDialogProps {
    open: boolean;
    title: string;
    message: string;
    actionType?: ConfirmActionType;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    infoContent?: ReactNode;

    commentLabel?: string;
    commentValue?: string;
    commentRequired?: boolean;
    commentRows?: number;
    onCommentChange?: (value: string) => void;

    onClose: () => void;
    onConfirm: () => void;
}

// Modal reutilizable para confirmar acciones importantes del sistema.
const ConfirmActionDialog = ({
    open,
    title,
    message,
    actionType = "custom",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false,
    infoContent,
    commentLabel,
    commentValue = "",
    commentRequired = false,
    commentRows = 3,
    onCommentChange,
    onClose,
    onConfirm,
}: ConfirmActionDialogProps) => {
    const showComment = Boolean(commentLabel);

    const isConfirmDisabled =
        loading || (commentRequired && !commentValue.trim());

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                        }}
                    >
                        {message}
                    </Typography>

                    {infoContent && (
                        <Alert severity="info">
                            {infoContent}
                        </Alert>
                    )}

                    {showComment && (
                        <TextField
                            label={commentLabel}
                            value={commentValue}
                            onChange={(event) =>
                                onCommentChange?.(event.target.value)
                            }
                            required={commentRequired}
                            multiline
                            minRows={commentRows}
                            fullWidth
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <ActionButton
                    actionType={actionType}
                    loading={loading}
                    loadingText="Procesando..."
                    disabled={isConfirmDisabled}
                    onClick={onConfirm}
                >
                    {confirmText}
                </ActionButton>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmActionDialog;