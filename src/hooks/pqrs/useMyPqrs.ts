import { useEffect, useState } from "react";
import type { MessageType, Pqr } from "../../interfaces/pqrs/pqr.interface";
import { getMyPqrs, ratePqr } from "../../services/pqrs/pqrService";
import {
  getSocket,
  listenPqrUnreadCountUpdated,
} from "../../services/sockets/socketService";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

// Hook encargado de manejar las PQR del usuario autenticado.
export const useMyPqrs = () => {
  // Lista de PQR creadas por el usuario.
  const [pqrs, setPqrs] = useState<Pqr[]>([]);

  // Controla la carga inicial de la vista.
  const [loading, setLoading] = useState(true);

  // Guarda errores generales al cargar las PQR.
  const [error, setError] = useState("");

  // PQR que tiene abierto el formulario de calificación.
  const [ratingPqrId, setRatingPqrId] = useState<number | null>(null);

  // Valor de la calificación seleccionada.
  const [rating, setRating] = useState<number | null>(null);

  // Comentario opcional de la calificación.
  const [ratingComment, setRatingComment] = useState("");

  // Controla el loading del botón de calificar.
  const [ratingLoading, setRatingLoading] = useState(false);

  // Guarda qué PQR tiene abierta la vista del chat.
  const [selectedChatPqrId, setSelectedChatPqrId] = useState<number | null>(
    null
  );

  // Estados para mensajes visuales.
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  // Carga las PQR del usuario autenticado desde el backend.
  const loadMyPqrs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyPqrs();

      setPqrs(response.pqrs);
    } catch (error) {
      console.error(error);
      setError("Error al cargar las PQR. Verifica que el usuario tenga el rol USER.");
    } finally {
      setLoading(false);
    }
  };

  // Abre el formulario de calificación dentro de la tarjeta.
  const openRatingForm = (pqrId: number) => {
    setRatingPqrId(pqrId);
    setRating(null);
    setRatingComment("");
  };

  // Cierra el formulario de calificación.
  const closeRatingForm = () => {
    if (ratingLoading) return;

    setRatingPqrId(null);
    setRating(null);
    setRatingComment("");
  };

  // Abre la vista de chat de una PQR.
  const openPqrChat = (pqrId: number) => {
    setSelectedChatPqrId(pqrId);

    // Limpia visualmente el contador al abrir el chat.
    setPqrs((currentPqrs) =>
      currentPqrs.map((pqr) =>
        pqr.id === pqrId
          ? {
            ...pqr,
            unreadMessagesCount: 0,
          }
          : pqr
      )
    );
  };

  // Cierra la vista de chat y regresa al listado de PQR del usuario.
  const closePqrChat = () => {
    setSelectedChatPqrId(null);
    loadMyPqrs();
  };

  // PQR seleccionada para mostrar en la vista del chat.
  const selectedChatPqr = pqrs.find((pqr) => pqr.id === selectedChatPqrId);

  // Muestra mensajes de éxito, error o advertencia.
  const showMessage = (text: string, type: MessageType) => {
    setMessage(text);
    setMessageType(type);
    setOpenMessage(true);
  };

  // Cierra el snackbar.
  const closeMessage = () => {
    setOpenMessage(false);
  };

  // Envía la calificación al backend.
  const submitRating = async (pqrId: number) => {
    if (!rating) {
      showMessage("Selecciona una calificación antes de enviar.", "warning");
      return;
    }

    try {
      setRatingLoading(true);

      const data =
        ratingComment.trim().length > 0
          ? {
            rating,
            ratingComment: ratingComment.trim(),
          }
          : {
            rating,
          };

      const response = await ratePqr(pqrId, data);

      setPqrs((currentPqrs) =>
        currentPqrs.map((pqr) =>
          pqr.id === pqrId ? response.pqr : pqr
        )
      );

      showMessage(response.message, "success");
      closeRatingForm();
    } catch (error) {
      console.error(error);
      showMessage(getErrorMessage(error), "error");
    } finally {
      setRatingLoading(false);
    }
  };

  // Carga las PQR y escucha actualizaciones del contador de mensajes en tiempo real.
  useEffect(() => {
    loadMyPqrs();

    listenPqrUnreadCountUpdated((data) => {
      setPqrs((currentPqrs) =>
        currentPqrs.map((pqr) =>
          pqr.id === data.pqrId
            ? {
              ...pqr,
              unreadMessagesCount: data.unreadMessagesCount,
            }
            : pqr
        )
      );
    });

    return () => {
      getSocket()?.off("pqr_unread_count_updated");
    };
  }, []);

  return {
    pqrs,
    loading,
    error,
    loadMyPqrs,

    ratingPqrId,
    rating,
    ratingComment,
    ratingLoading,

    selectedChatPqrId,
    selectedChatPqr,
    openPqrChat,
    closePqrChat,

    openMessage,
    message,
    messageType,

    setRating,
    setRatingComment,
    openRatingForm,
    closeRatingForm,
    submitRating,
    closeMessage,
  };
};