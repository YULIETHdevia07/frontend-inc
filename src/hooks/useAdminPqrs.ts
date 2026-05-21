import { useEffect, useState } from "react";
import { ValidationError } from "yup";
import type { Pqr, PqrStatus } from "../interfaces/pqr.interface";
import {
    getAllPqrs,
    respondPqr,
    updatePqrStatus,
} from "../services/pqrService";
import { responsePqrSchema } from "../validations/pqrValidation";

// Hook encargado de manejar la lógica administrativa de PQR.
export const useAdminPqrs = () => {
    // Lista de todas las PQR del sistema.
    const [pqrs, setPqrs] = useState<Pqr[]>([]);

    // Controla la carga inicial de la vista.
    const [loading, setLoading] = useState(true);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Mensaje de éxito mostrado sobre una PQR.
    const [successMessage, setSuccessMessage] = useState("");

    // Id de la PQR donde se muestra el mensaje de éxito.
    const [successPqrId, setSuccessPqrId] = useState<number | null>(null);

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
        const newStatus = statusChanges[pqrId];

        if (!newStatus) {
            return;
        }

        try {
            setError("");
            setSuccessMessage("");
            setSuccessPqrId(null);

            await updatePqrStatus(pqrId, newStatus);

            setSuccessMessage("Estado actualizado correctamente.");
            setSuccessPqrId(pqrId);

            await loadAllPqrs();

            setStatusChanges((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });
        } catch (error) {
            console.error(error);
            setError("Error al actualizar el estado de la PQR.");
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

            setError("");
            setSuccessMessage("");
            setSuccessPqrId(null);

            setResponseErrors((prev) => ({
                ...prev,
                [pqrId]: "",
            }));

            await respondPqr(pqrId, responseText.trim());

            setSuccessMessage("PQR respondida correctamente.");
            setSuccessPqrId(pqrId);

            await loadAllPqrs();

            setResponseTexts((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                setResponseErrors((prev) => ({
                    ...prev,
                    [pqrId]: error.message,
                }));

                return;
            }

            console.error(error);

            setResponseErrors((prev) => ({
                ...prev,
                [pqrId]: "Error al responder la PQR.",
            }));
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

        successMessage,
        successPqrId,

        statusChanges,
        responseTexts,
        responseErrors,

        handleStatusChange,
        handleUpdateStatus,
        handleResponseTextChange,
        handleRespondPqr,
    };
};