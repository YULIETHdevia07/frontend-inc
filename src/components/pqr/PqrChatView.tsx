import { useEffect, useRef } from "react";
import {
    Alert,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Link,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import type { Pqr, PqrMessage, UserRole } from "../../interfaces/pqrs/pqr.interface";
import {
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrs/pqrUtils";
import { pqrStatusOptions } from "../../data/pqrOptions";
import { getInitials } from "../../utils/common/avatarUtils";
import { formatDate } from "../../utils/common/dateUtils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface PqrChatViewProps {
    pqr: Pqr;
    messages: PqrMessage[];
    messageText: string;
    selectedFile: File | null;
    loadingMessages: boolean;
    sendingAttachment: boolean;
    chatError: string;
    currentUserRole: UserRole;
    onBack: () => void;
    onMessageChange: (value: string) => void;
    onSendMessage: () => void;
    onSelectFile: (file: File | null) => void;
    onRemoveSelectedFile: () => void;
    onClearError: () => void;
}

// Vista reutilizable para mostrar el chat de seguimiento de una PQR.
export const PqrChatView = ({
    pqr,
    messages,
    messageText,
    selectedFile,
    loadingMessages,
    sendingAttachment,
    chatError,
    currentUserRole,
    onBack,
    onMessageChange,
    onSendMessage,
    onSelectFile,
    onRemoveSelectedFile,
    onClearError,
}: PqrChatViewProps) => {
    const theme = useTheme();

    // Referencia al input oculto para seleccionar archivos.
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Referencia del chat para bajar automáticamente al último mensaje.
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const isClosed = pqr.status === "CERRADA";

    const getStatusLabel = () => {
        return (
            pqrStatusOptions.find((option) => option.value === pqr.status)
                ?.label || pqr.status
        );
    };

    // Abre el selector de archivos.
    const handleOpenFileInput = () => {
        fileInputRef.current?.click();
    };

    // Guarda el archivo seleccionado sin enviarlo inmediatamente.
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        onSelectFile(file);

        event.target.value = "";
    };

    // Construye la URL completa del archivo.
    const getAttachmentUrl = (fileUrl: string) => {
        return `${BACKEND_URL}${fileUrl}`;
    };

    // Baja automáticamente al último mensaje cuando cambia el historial del chat.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const style = {
        chatViewContainer: {
            width: "100%",
            height: "calc(100vh - 96px)",
            minHeight: 0,
            overflow: "hidden",
        },

        chatShell: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
        },

        chatHeader: {
            flexShrink: 0,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            px: {
                xs: 2,
                md: 2.5,
            },
            py: 1.75,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
        },

        chatBackBtn: {
            flexShrink: 0,
            width: 36,
            height: 36,
            mt: "2px",
            borderRadius: "10px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.secondary,
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.main, 0.25),
            },
        },

        chatHeaderContent: {
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
        },

        chatTitleRow: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
        },

        chatCaseTitle: {
            fontSize: {
                xs: "0.95rem",
                md: "1rem",
            },
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: 1.25,
        },

        chatIdChip: {
            height: 22,
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "0.7rem",
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.light,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            "& .MuiChip-label": {
                px: 1,
            },
        },

        chatStatusChip: {
            height: 22,
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "0.7rem",
            px: 0.5,
        },

        chatMetaRow: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            mt: 0.25,
        },

        chatMetaItem: {
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: "0.75rem",
            color: theme.palette.text.disabled,
        },

        chatMetaDot: {
            width: 3,
            height: 3,
            borderRadius: "50%",
            backgroundColor: theme.palette.divider,
        },

        chatBody: {
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: {
                xs: 2,
                md: 2.5,
            },
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            backgroundColor: theme.palette.background.default,
        },

        dateDivider: {
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            my: 0.5,
        },

        dateDividerLine: {
            flex: 1,
            height: "1px",
            backgroundColor: theme.palette.divider,
        },

        dateDividerText: {
            fontSize: "0.7rem",
            color: theme.palette.text.disabled,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
        },

        msgRowReceived: {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 1,
        },

        msgRowMine: {
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            gap: 1,
        },

        msgAvatar: {
            width: 32,
            height: 32,
            fontSize: "0.7rem",
            fontWeight: 700,
            flexShrink: 0,
        },

        receivedAvatar: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.dark,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        },

        mineAvatar: {
            backgroundColor: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.main,
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
        },

        msgBubbleWrapperReceived: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: {
                xs: "80%",
                md: "70%",
            },
        },

        msgBubbleWrapperMine: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            maxWidth: {
                xs: "80%",
                md: "70%",
            },
        },

        msgSenderName: {
            fontSize: "0.72rem",
            fontWeight: 700,
            color: theme.palette.text.secondary,
            mb: 0.35,
            px: 0.5,
        },

        msgSenderNameMine: {
            fontSize: "0.72rem",
            fontWeight: 700,
            color: theme.palette.text.secondary,
            mb: 0.35,
            px: 0.5,
            textAlign: "right",
        },

        bubbleReceived: {
            px: 1.75,
            py: 1.25,
            borderRadius: "16px 16px 16px 4px",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            fontSize: "0.875rem",
            lineHeight: 1.55,
            color: theme.palette.text.primary,
            whiteSpace: "pre-wrap",
        },

        bubbleMine: {
            px: 1.75,
            py: 1.25,
            borderRadius: "16px 16px 4px 16px",
            backgroundColor: theme.palette.primary.main,
            fontSize: "0.875rem",
            lineHeight: 1.55,
            color: theme.palette.primary.contrastText,
            whiteSpace: "pre-wrap",
        },

        attachmentImage: {
            display: "block",
            maxWidth: "240px",
            width: "100%",
            borderRadius: "12px",
            mt: 1,
            border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
        },

        attachmentFile: {
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
            px: 1.25,
            py: 1,
            borderRadius: "10px",
            backgroundColor: alpha(theme.palette.common.white, 0.16),
            border: `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
        },

        attachmentFileReceived: {
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
        },

        attachmentFileName: {
            fontSize: "0.78rem",
            fontWeight: 600,
            wordBreak: "break-word",
        },

        msgTime: {
            fontSize: "0.7rem",
            color: theme.palette.text.disabled,
            mt: 0.5,
            px: 0.5,
        },

        selectedFilePreview: {
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            mx: {
                xs: 1.5,
                md: 2,
            },
            mt: 1.25,
            px: 1.25,
            py: 0.9,
            borderRadius: "12px",
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        },

        selectedFileName: {
            flex: 1,
            fontSize: "0.78rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
            wordBreak: "break-word",
        },

        removeSelectedFileBtn: {
            width: 28,
            height: 28,
            color: theme.palette.error.main,
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.16),
            },
        },

        chatFooter: {
            flexShrink: 0,
            px: {
                xs: 1.5,
                md: 2,
            },
            py: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
        },

        chatTextInput: {
            flex: 1,
            "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontSize: "0.875rem",
                backgroundColor: theme.palette.background.default,
            },
        },

        chatAttachBtn: {
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.default,
            "&:hover": {
                color: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.main, 0.35),
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
        },

        chatSendBtn: {
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: "12px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
                backgroundColor: theme.palette.primary.dark,
            },
            "&:disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
            },
        },

        closedBanner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            backgroundColor: theme.palette.background.default,
            borderTop: `1px solid ${theme.palette.divider}`,
            fontSize: "0.8rem",
            color: theme.palette.text.disabled,
        },
    };

    return (
        <Box sx={style.chatViewContainer}>
            <Paper elevation={0} sx={style.chatShell}>
                <Box sx={style.chatHeader}>
                    <IconButton onClick={onBack} sx={style.chatBackBtn}>
                        <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    <Box sx={style.chatHeaderContent}>
                        <Box sx={style.chatTitleRow}>
                            <Typography sx={style.chatCaseTitle}>
                                {getCaseTypeLabel(pqr.caseType)}
                            </Typography>

                            <Chip
                                label={`PQR #${pqr.id}`}
                                size="small"
                                sx={style.chatIdChip}
                            />

                            <Chip
                                label={getStatusLabel()}
                                color={getStatusColor(pqr.status)}
                                size="small"
                                sx={style.chatStatusChip}
                            />
                        </Box>

                        <Box sx={style.chatMetaRow}>
                            <Box sx={style.chatMetaItem}>
                                <CalendarMonthOutlinedIcon
                                    sx={{ fontSize: 12 }}
                                />
                                {formatDate(pqr.createdAt)}
                            </Box>

                            {pqr.user && (
                                <>
                                    <Box sx={style.chatMetaDot} />

                                    <Box sx={style.chatMetaItem}>
                                        <PersonOutlineOutlinedIcon
                                            sx={{ fontSize: 12 }}
                                        />
                                        {pqr.user?.name || "Sin usuario"}
                                    </Box>
                                </>
                            )}

                            {pqr.assignedTo && (
                                <>
                                    <Box sx={style.chatMetaDot} />

                                    <Box sx={style.chatMetaItem}>
                                        <HeadsetMicOutlinedIcon
                                            sx={{ fontSize: 12 }}
                                        />
                                        {pqr.assignedTo.name}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box sx={style.chatBody}>
                    {loadingMessages ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 4,
                            }}
                        >
                            <CircularProgress size={24} />
                        </Box>
                    ) : messages.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                mt: 4,
                                color: "text.disabled",
                                fontSize: "0.85rem",
                            }}
                        >
                            No hay mensajes aún. Inicia la conversación.
                        </Box>
                    ) : (
                        messages.map((msg, index) => {
                            // Define si el chat se está viendo desde usuario o soporte.
                            const isUserView = currentUserRole === "USER";

                            const isSupportView =
                                currentUserRole === "ADMIN" ||
                                currentUserRole === "AGENT";

                            // Define si el mensaje fue enviado por soporte.
                            const isSupportMessage =
                                msg.sender.role === "ADMIN" ||
                                msg.sender.role === "AGENT";

                            // Define si el mensaje pertenece al lado de quien está viendo el chat.
                            const isMine = isSupportView
                                ? isSupportMessage
                                : msg.sender.role === "USER";

                            // Separa los mensajes por fecha.
                            const showDateDivider =
                                index === 0 ||
                                new Date(msg.createdAt).toDateString() !==
                                new Date(
                                    messages[index - 1].createdAt
                                ).toDateString();

                            return (
                                <Box key={msg.id}>
                                    {showDateDivider && (
                                        <Box sx={style.dateDivider}>
                                            <Box sx={style.dateDividerLine} />

                                            <Typography
                                                sx={style.dateDividerText}
                                            >
                                                {formatDate(msg.createdAt)}
                                            </Typography>

                                            <Box sx={style.dateDividerLine} />
                                        </Box>
                                    )}

                                    <Box
                                        sx={
                                            isMine
                                                ? style.msgRowMine
                                                : style.msgRowReceived
                                        }
                                    >
                                        {!isUserView && (
                                            <Avatar
                                                sx={{
                                                    ...style.msgAvatar,
                                                    ...(isMine
                                                        ? style.mineAvatar
                                                        : style.receivedAvatar),
                                                }}
                                            >
                                                {getInitials(
                                                    msg.sender.name || "N/A"
                                                )}
                                            </Avatar>
                                        )}

                                        <Box
                                            sx={
                                                isMine
                                                    ? style.msgBubbleWrapperMine
                                                    : style.msgBubbleWrapperReceived
                                            }
                                        >
                                            {!isUserView && (
                                                <Typography
                                                    sx={
                                                        isMine
                                                            ? style.msgSenderNameMine
                                                            : style.msgSenderName
                                                    }
                                                >
                                                    {msg.sender.name || "N/A"}
                                                </Typography>
                                            )}

                                            <Box
                                                sx={
                                                    isMine
                                                        ? style.bubbleMine
                                                        : style.bubbleReceived
                                                }
                                            >
                                                {msg.content && (
                                                    <Typography
                                                        component="div"
                                                        sx={{
                                                            fontSize: "0.875rem",
                                                            lineHeight: 1.55,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </Typography>
                                                )}

                                                {msg.attachments?.map(
                                                    (attachment) => {
                                                        const attachmentUrl =
                                                            getAttachmentUrl(
                                                                attachment.fileUrl
                                                            );

                                                        if (
                                                            attachment.fileType ===
                                                            "IMAGE"
                                                        ) {
                                                            return (
                                                                <Box
                                                                    key={
                                                                        attachment.id
                                                                    }
                                                                    component="img"
                                                                    src={
                                                                        attachmentUrl
                                                                    }
                                                                    alt={
                                                                        attachment.originalName
                                                                    }
                                                                    sx={
                                                                        style.attachmentImage
                                                                    }
                                                                />
                                                            );
                                                        }

                                                        return (
                                                            <Link
                                                                key={
                                                                    attachment.id
                                                                }
                                                                href={
                                                                    attachmentUrl
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                underline="none"
                                                                color="inherit"
                                                                sx={{
                                                                    ...style.attachmentFile,
                                                                    ...(!isMine
                                                                        ? style.attachmentFileReceived
                                                                        : {}),
                                                                }}
                                                            >
                                                                <InsertDriveFileOutlinedIcon
                                                                    sx={{
                                                                        fontSize: 22,
                                                                        flexShrink: 0,
                                                                    }}
                                                                />

                                                                <Typography
                                                                    sx={
                                                                        style.attachmentFileName
                                                                    }
                                                                >
                                                                    {
                                                                        attachment.originalName
                                                                    }
                                                                </Typography>
                                                            </Link>
                                                        );
                                                    }
                                                )}
                                            </Box>

                                            <Typography sx={style.msgTime}>
                                                {new Date(
                                                    msg.createdAt
                                                ).toLocaleTimeString("es-CO", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })
                    )}

                    {chatError && (
                        <Alert
                            severity="error"
                            onClose={onClearError}
                            sx={{ borderRadius: 2 }}
                        >
                            {chatError}
                        </Alert>
                    )}

                    <Box ref={messagesEndRef} />
                </Box>

                {isClosed ? (
                    <Box sx={style.closedBanner}>
                        <LockOutlinedIcon sx={{ fontSize: 16 }} />

                        <Typography variant="caption">
                            Esta PQR está cerrada. No se pueden enviar más
                            mensajes.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {selectedFile && (
                            <Box sx={style.selectedFilePreview}>
                                <InsertDriveFileOutlinedIcon
                                    sx={{ fontSize: 18 }}
                                />

                                <Typography sx={style.selectedFileName}>
                                    {selectedFile.name}
                                </Typography>

                                <Tooltip title="Quitar archivo">
                                    <IconButton
                                        size="small"
                                        onClick={onRemoveSelectedFile}
                                        sx={style.removeSelectedFileBtn}
                                    >
                                        <CloseOutlinedIcon
                                            sx={{ fontSize: 16 }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}

                        <Box sx={style.chatFooter}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept=".jpg,.jpeg,.png,.webp,.pdf"
                                onChange={handleFileChange}
                            />

                            <IconButton
                                onClick={handleOpenFileInput}
                                disabled={sendingAttachment}
                                sx={style.chatAttachBtn}
                            >
                                {sendingAttachment ? (
                                    <CircularProgress size={18} />
                                ) : (
                                    <AttachFileOutlinedIcon sx={{ fontSize: 18 }} />
                                )}
                            </IconButton>

                            <TextField
                                fullWidth
                                multiline
                                minRows={1}
                                maxRows={4}
                                placeholder="Escribe un mensaje..."
                                value={messageText}
                                onChange={(event) =>
                                    onMessageChange(event.target.value)
                                }
                                size="small"
                                sx={style.chatTextInput}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        !event.shiftKey
                                    ) {
                                        event.preventDefault();
                                        onSendMessage();
                                    }
                                }}
                            />

                            <IconButton
                                onClick={onSendMessage}
                                disabled={
                                    sendingAttachment ||
                                    (!messageText.trim() && !selectedFile)
                                }
                                sx={style.chatSendBtn}
                            >
                                <SendOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};