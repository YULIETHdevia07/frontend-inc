import {
    Alert,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import type { Pqr, PqrMessage } from "../../interfaces/pqr.interface";
import {
    formatDate,
    getCaseTypeLabel,
    getStatusColor,
} from "../../utils/pqrUtils";
import { pqrStatusOptions } from "../../data/pqrOptions";
import { getInitials } from "../../utils/avatarUtils";

interface PqrChatViewProps {
    pqr: Pqr;
    messages: PqrMessage[];
    messageText: string;
    loadingMessages: boolean;
    chatError: string;
    onBack: () => void;
    onMessageChange: (value: string) => void;
    onSendMessage: () => void;
    onClearError: () => void;
}

// Vista reutilizable para mostrar el chat de seguimiento de una PQR.
export const PqrChatView = ({
    pqr,
    messages,
    messageText,
    loadingMessages,
    chatError,
    onBack,
    onMessageChange,
    onSendMessage,
    onClearError,
}: PqrChatViewProps) => {
    const theme = useTheme();

    const isClosed = pqr.status === "CERRADA";

    const getStatusLabel = () => {
        return (
            pqrStatusOptions.find((option) => option.value === pqr.status)
                ?.label || pqr.status
        );
    };

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
                backgroundColor: `${theme.palette.primary.main}12`,
                color: theme.palette.primary.main,
                borderColor: `${theme.palette.primary.main}40`,
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
            color: "#1d4ed8",
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
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

        chatDescription: {
            fontSize: "0.85rem",
            color: theme.palette.text.secondary,
            lineHeight: 1.5,
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

        msgRowAgent: {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 1,
        },

        msgRowUser: {
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

        agentAvatar: {
            backgroundColor: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
        },

        userAvatar: {
            backgroundColor: `${theme.palette.success.light}30`,
            color: theme.palette.success.dark,
            border: `1px solid ${theme.palette.success.light}`,
        },

        msgBubbleWrapper: {
            display: "flex",
            flexDirection: "column",
            maxWidth: {
                xs: "80%",
                md: "70%",
            },
        },

        msgBubbleWrapperUser: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            maxWidth: {
                xs: "80%",
                md: "70%",
            },
        },

        bubbleAgent: {
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

        bubbleUser: {
            px: 1.75,
            py: 1.25,
            borderRadius: "16px 16px 4px 16px",
            backgroundColor: theme.palette.primary.main,
            fontSize: "0.875rem",
            lineHeight: 1.55,
            color: "#fff",
            whiteSpace: "pre-wrap",
        },

        msgTime: {
            fontSize: "0.7rem",
            color: theme.palette.text.disabled,
            mt: 0.5,
            px: 0.5,
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

        chatSendBtn: {
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: "12px",
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
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

                        <Typography sx={style.chatDescription}>
                            {pqr.description}
                        </Typography>

                        <Box sx={style.chatMetaRow}>
                            <Box sx={style.chatMetaItem}>
                                <CalendarMonthOutlinedIcon
                                    sx={{ fontSize: 12 }}
                                />
                                {formatDate(pqr.createdAt)}
                            </Box>

                            <Box sx={style.chatMetaDot} />

                            <Box sx={style.chatMetaItem}>
                                <PersonOutlineOutlinedIcon
                                    sx={{ fontSize: 12 }}
                                />
                                {pqr.user?.name || "Sin usuario"}
                            </Box>

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
                            const isAgent =
                                msg.sender.role === "AGENT" ||
                                msg.sender.role === "ADMIN";

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
                                            isAgent
                                                ? style.msgRowAgent
                                                : style.msgRowUser
                                        }
                                    >
                                        <Avatar
                                            sx={{
                                                ...style.msgAvatar,
                                                ...(isAgent
                                                    ? style.agentAvatar
                                                    : style.userAvatar),
                                            }}
                                        >
                                            {getInitials(msg.sender.name)}
                                        </Avatar>

                                        <Box
                                            sx={
                                                isAgent
                                                    ? style.msgBubbleWrapper
                                                    : style.msgBubbleWrapperUser
                                            }
                                        >
                                            <Box
                                                sx={
                                                    isAgent
                                                        ? style.bubbleAgent
                                                        : style.bubbleUser
                                                }
                                            >
                                                {msg.content}
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
                    <Box sx={style.chatFooter}>
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
                            disabled={!messageText.trim()}
                            sx={style.chatSendBtn}
                        >
                            <SendOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};