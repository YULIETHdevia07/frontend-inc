import { useCallback, useEffect, useRef, useState } from "react";
import type {
    PqrMessage,
    UsePqrChatParams,
} from "../interfaces/pqr.interface";
import { getPqrMessages } from "../services/pqrService";
import {
    connectPqrSocket,
    getPqrSocket,
    joinPqrRoom,
    listenJoinedPqrRoom,
    listenNewPqrMessage,
    listenPqrSocketError,
    removePqrSocketListeners,
    sendPqrMessage,
} from "../services/pqrSocketService";
import { getErrorMessage } from "../utils/getErrorMessage";

// Hook encargado de manejar el historial, conexión y envío de mensajes del chat PQR.
export const usePqrChat = ({ pqrId, token }: UsePqrChatParams) => {
    // Mensajes cargados desde el historial y recibidos en tiempo real.
    const [messages, setMessages] = useState<PqrMessage[]>([]);

    // Texto que el usuario está escribiendo en el input del chat.
    const [messageText, setMessageText] = useState("");

    // Controla la carga inicial del historial de mensajes.
    const [loadingMessages, setLoadingMessages] = useState(false);

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

    // Envía un mensaje al backend mediante Socket.IO.
    const handleSendMessage = useCallback(() => {
        if (!pqrId) return;

        const cleanMessage = messageText.trim();

        if (!cleanMessage) {
            setChatError("El mensaje no puede estar vacío.");
            return;
        }

        sendPqrMessage(pqrId, cleanMessage);
        setMessageText("");
        setChatError("");
    }, [pqrId, messageText]);

    useEffect(() => {
        isMountedRef.current = true;
        currentPqrIdRef.current = pqrId;

        if (!pqrId || !token) {
            setMessages([]);
            setMessageText("");
            setChatError("");
            setIsSocketConnected(false);
            return;
        }

        // Limpia el estado visual cuando se cambia de PQR.
        setMessages([]);
        setMessageText("");
        setChatError("");

        loadMessages();

        const socket = connectPqrSocket(token);

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
        });

        listenPqrSocketError((error) => {
            setChatError(error.message);
        });

        return () => {
            isMountedRef.current = false;

            const currentSocket = getPqrSocket();

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
        loadingMessages,
        chatError,
        setChatError,
        isSocketConnected,
        loadMessages,
        handleSendMessage,
    };
};