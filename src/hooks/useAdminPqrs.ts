import { useEffect, useState } from "react";
import { ValidationError } from "yup";
import type { MessageType, Pqr, PqrStatus } from "../interfaces/pqr.interface";
import {
    getAllPqrs,
    respondPqr,
    updatePqrStatus,
} from "../services/pqrService";
import { responsePqrSchema } from "../validations/pqrValidation";
import { getErrorMessage } from "../utils/getErrorMessage";

// Hook encargado de manejar la lógica administrativa de PQR.
export const useAdminPqrs = () => {
    // Lista de todas las PQR del sistema.
    const [pqrs, setPqrs] = useState<Pqr[]>([]);

    // Controla la carga inicial de la vista.
    const [loading, setLoading] = useState(true);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Guarda temporalmente los estados seleccionados.
    const [statusChanges, setStatusChanges] = useState<Record<number, PqrStatus>>(
        {}
    );

    // Guarda las respuestas escritas por PQR.
    const [responseTexts, setResponseTexts] = useState<Record<number, string>>(
        {}
    );

    // Guarda errores de validación por PQR.
    const [responseErrors, setResponseErrors] = useState<Record<number, string>>(
        {}
    );

    // Mensaje mostrado en el snackbar.
    const [message, setMessage] = useState("");

    // Tipo visual del mensaje: success, error, info o warning.
    const [messageType, setMessageType] = useState<MessageType>("success");

    // Controla si el snackbar está abierto.
    const [openMessage, setOpenMessage] = useState(false);

    // Muestra un mensaje temporal en pantalla.
    const showSnackbar = (text: string, type: MessageType = "success") => {
        setMessage(text);
        setMessageType(type);
        setOpenMessage(true);
    };

    // Cierra el mensaje temporal.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Carga todas las PQR para el administrador.
    const loadAllPqrs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllPqrs();

            setPqrs(response.pqrs);
        } catch (error) {
            console.error(error);

            setError("Error al cargar las PQR. Verifica que el usuario tenga rol ADMIN.");
        } finally {
            setLoading(false);
        }
    };

    // Guarda el estado seleccionado de una PQR.
    const handleStatusChange = (pqrId: number, status: string) => {
        setStatusChanges((prev) => {
            const updated = { ...prev };

            if (!status) {
                delete updated[pqrId];
                return updated;
            }

            updated[pqrId] = status as PqrStatus;
            return updated;
        });
    };

    // Actualiza el estado de una PQR.
    const handleUpdateStatus = async (pqrId: number) => {

        try {
            const newStatus = statusChanges[pqrId];

            if (!newStatus) {
                showSnackbar("Debes seleccionar un estado.", "warning");
                return;
            }
            const response = await updatePqrStatus(pqrId, newStatus);

            // Actualiza inmediatamente el estado en la vista sin recargar toda la lista.
            setPqrs((prev) =>
                prev.map((pqr) =>
                    pqr.id === pqrId
                        ? {
                            ...pqr,
                            ...response.pqr,
                            status: newStatus,
                        }
                        : pqr
                )
            );

            // Limpia el cambio temporal después de actualizar la PQR.
            setStatusChanges((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });

            showSnackbar(
                response.message || "Estado actualizado correctamente.",
                "success"
            );
        } catch (error) {
            console.error(error);

            showSnackbar(
                getErrorMessage(error, "Error al actualizar el estado de la PQR."),
                "error"
            );
        }
    };

    // Guarda el texto escrito como respuesta.
    const handleResponseTextChange = (pqrId: number, value: string) => {
        setResponseTexts((prev) => ({
            ...prev,
            [pqrId]: value,
        }));

        setResponseErrors((prev) => ({
            ...prev,
            [pqrId]: "",
        }));
    };

    // Valida con Yup y envía la respuesta de una PQR.
    const handleRespondPqr = async (pqrId: number) => {
        const responseText = responseTexts[pqrId] || "";

        try {
            await responsePqrSchema.validate(responseText);

            setResponseErrors((prev) => ({
                ...prev,
                [pqrId]: "",
            }));

            const response = await respondPqr(pqrId, responseText.trim());

            // Actualiza solo la PQR respondida sin recargar toda la vista.
            setPqrs((prev) =>
                prev.map((pqr) => (pqr.id === pqrId ? response.pqr : pqr))
            );

            // Limpia el campo de respuesta después de enviar.
            setResponseTexts((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });

            showSnackbar(
                response.message || "Respuesta enviada correctamente.",
                "success"
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                setResponseErrors((prev) => ({
                    ...prev,
                    [pqrId]: error.message,
                }));

                return;
            }

            console.error(error);

            showSnackbar(
                getErrorMessage(error, "Error al responder la PQR."),
                "error"
            );
        }
    };

    // Carga las PQR cuando se abre la vista.
    useEffect(() => {
        loadAllPqrs();
    }, []);

    return {
        pqrs,
        loading,
        error,

        statusChanges,
        responseTexts,
        responseErrors,

        message,
        messageType,
        openMessage,
        closeMessage,

        handleStatusChange,
        handleUpdateStatus,
        handleResponseTextChange,
        handleRespondPqr,
    };
};