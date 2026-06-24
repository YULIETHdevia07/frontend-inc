import { useCallback, useEffect, useRef, useState } from "react";
import type {
    PqrMessage,
    UsePqrChatParams,
} from "../../interfaces/pqrs/pqr.interface";
import {
    getPqrMessages,
    markPqrChatAsRead,
    sendPqrMessageWithAttachment,
} from "../../services/pqrs/pqrService";
import {
    connectSocket,
    getSocket,
    joinPqrRoom,
    listenJoinedPqrRoom,
    listenNewPqrMessage,
    listenSocketError,
    removePqrSocketListeners,
    sendPqrMessage,
} from "../../services/sockets/socketService";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

// Hook encargado de manejar el historial, conexión y envío de mensajes del chat PQR.
export const usePqrChat = ({ pqrId, token }: UsePqrChatParams) => {
    // Mensajes cargados desde el historial y recibidos en tiempo real.
    const [messages, setMessages] = useState<PqrMessage[]>([]);

    // Texto que el usuario está escribiendo en el input del chat.
    const [messageText, setMessageText] = useState("");

    // Archivo seleccionado, pero aún no enviado.
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Controla la carga inicial del historial de mensajes.
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Controla el envío de archivos adjuntos.
    const [sendingAttachment, setSendingAttachment] = useState(false);

    // Mensaje de error del chat o del socket.
    const [chatError, setChatError] = useState("");

    // Estado visual de la conexión con Socket.IO.
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // Evita actualizar estados si el componente ya se desmontó.
    const isMountedRef = useRef(true);

    // Guarda el id actual de la PQR para validar mensajes recibidos.
    const currentPqrIdRef = useRef<number | null>(pqrId);

    // Carga el historial de mensajes de la PQR seleccionada.
    const loadMessages = useCallback(async () => {
        if (!pqrId) return;

        try {
            setLoadingMessages(true);
            setChatError("");

            const response = await getPqrMessages(pqrId);

            await markPqrChatAsRead(pqrId);

            if (!isMountedRef.current) return;

            setMessages(response.messages);
        } catch (error) {
            if (!isMountedRef.current) return;

            setChatError(
                getErrorMessage(error, "Error al cargar los mensajes.")
            );
        } finally {
            if (isMountedRef.current) {
                setLoadingMessages(false);
            }
        }
    }, [pqrId]);

    // Guarda el archivo seleccionado.
    const handleSelectFile = useCallback((file: File | null) => {
        setSelectedFile(file);
        setChatError("");
    }, []);

    // Quita el archivo seleccionado.
    const handleRemoveSelectedFile = useCallback(() => {
        setSelectedFile(null);
    }, []);

    // Envía texto solo, archivo solo o texto con archivo.
    const handleSendMessage = useCallback(async () => {
        if (!pqrId) return;

        const cleanMessage = messageText.trim();

        if (!cleanMessage && !selectedFile) {
            setChatError("Debes escribir un mensaje o seleccionar un archivo.");
            return;
        }

        try {
            setChatError("");

            if (selectedFile) {
                setSendingAttachment(true);

                await sendPqrMessageWithAttachment(
                    pqrId,
                    selectedFile,
                    cleanMessage
                );

                setSelectedFile(null);
            } else {
                sendPqrMessage(pqrId, cleanMessage);
            }

            setMessageText("");
        } catch (error) {
            setChatError(
                getErrorMessage(error, "Error al enviar el mensaje.")
            );
        } finally {
            setSendingAttachment(false);
        }
    }, [pqrId, messageText, selectedFile]);

    useEffect(() => {
        isMountedRef.current = true;
        currentPqrIdRef.current = pqrId;

        if (!pqrId || !token) {
            setMessages([]);
            setMessageText("");
            setSelectedFile(null);
            setChatError("");
            setIsSocketConnected(false);
            return;
        }

        // Limpia el estado visual cuando se cambia de PQR.
        setMessages([]);
        setMessageText("");
        setSelectedFile(null);
        setChatError("");

        loadMessages();

        const socket = connectSocket(token);

        setIsSocketConnected(socket.connected);

        const handleConnect = () => {
            setIsSocketConnected(true);
            joinPqrRoom(pqrId);
        };

        const handleDisconnect = () => {
            setIsSocketConnected(false);
        };

        const handleConnectError = () => {
            setIsSocketConnected(false);
            setChatError("No fue posible conectar el chat en tiempo real.");
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        if (socket.connected) {
            joinPqrRoom(pqrId);
        }

        listenJoinedPqrRoom((data) => {
            if (data.pqrId !== currentPqrIdRef.current) return;

            setChatError("");
        });

        listenNewPqrMessage((newMessage) => {
            if (newMessage.pqrId !== currentPqrIdRef.current) return;

            setMessages((prevMessages) => {
                const alreadyExists = prevMessages.some(
                    (message) => message.id === newMessage.id
                );

                if (alreadyExists) {
                    return prevMessages;
                }

                return [...prevMessages, newMessage];
            });

            markPqrChatAsRead(newMessage.pqrId).catch(() => { });
        });

        listenSocketError((error) => {
            setChatError(error.message);
        });

        return () => {
            isMountedRef.current = false;

            const currentSocket = getSocket();

            currentSocket?.off("connect", handleConnect);
            currentSocket?.off("disconnect", handleDisconnect);
            currentSocket?.off("connect_error", handleConnectError);

            removePqrSocketListeners();
        };
    }, [pqrId, token, loadMessages]);

    return {
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
        isSocketConnected,
        loadMessages,
        handleSendMessage,
    };
};