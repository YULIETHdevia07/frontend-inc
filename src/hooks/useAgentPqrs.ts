import { useEffect, useMemo, useState } from "react";
import type {
    AgentPqrView,
    MessageType,
    Pqr,
    PqrStatus,
} from "../interfaces/pqr.interface";
import {
    getAvailablePqrs,
    getMyAssignedPqrs,
    respondPqr,
    takePqr,
    updatePqrStatus,
} from "../services/pqrService";

// Obtiene un mensaje de error seguro desde una respuesta del backend.
const getErrorMessage = (error: unknown, defaultMessage: string) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const axiosError = error as {
            response?: {
                data?: {
                    message?: string;
                };
            };
        };

        return axiosError.response?.data?.message || defaultMessage;
    }

    return defaultMessage;
};

// Hook encargado de manejar la lógica de las PQR del agente.
export const useAgentPqrs = () => {
    // PQR disponibles para ser tomadas por el agente.
    const [availablePqrs, setAvailablePqrs] = useState<Pqr[]>([]);

    // PQR que ya fueron asignadas al agente autenticado.
    const [assignedPqrs, setAssignedPqrs] = useState<Pqr[]>([]);

    // Controla la carga inicial de la información.
    const [loading, setLoading] = useState(true);

    // Guarda el id de la PQR que se está tomando.
    const [takingPqrId, setTakingPqrId] = useState<number | null>(null);

    // Guarda el id de la PQR cuyo estado se está actualizando.
    const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

    // Guarda el id de la PQR que se está respondiendo.
    const [respondingPqrId, setRespondingPqrId] = useState<number | null>(null);

    // Controla si se muestran PQR disponibles o asignadas.
    const [activeView, setActiveView] = useState<AgentPqrView>("AVAILABLE");

    // Controla el filtro por estado.
    const [statusFilter, setStatusFilter] = useState<"ALL" | PqrStatus>("ALL");

    // Guarda el texto escrito en el buscador.
    const [searchTerm, setSearchTerm] = useState("");

    // Controla si el campo de búsqueda está visible.
    const [showSearch, setShowSearch] = useState(false);

    // Guarda el nuevo estado seleccionado por cada PQR.
    const [statusByPqrId, setStatusByPqrId] = useState<Record<number, PqrStatus>>(
        {}
    );

    // Guarda el texto de respuesta escrito por cada PQR.
    const [responseTexts, setResponseTexts] = useState<Record<number, string>>(
        {}
    );

    // Guarda errores de validación por cada respuesta.
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

    // Carga las PQR disponibles y las asignadas al agente.
    const loadAgentPqrs = async () => {
        try {
            setLoading(true);

            const [availableResponse, assignedResponse] = await Promise.all([
                getAvailablePqrs(),
                getMyAssignedPqrs(),
            ]);

            setAvailablePqrs(availableResponse.pqrs);
            setAssignedPqrs(assignedResponse.pqrs);
        } catch (error) {
            console.error(error);

            showSnackbar(
                getErrorMessage(error, "Error al cargar las PQR del agente."),
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // Permite que el agente tome una PQR disponible.
    const handleTakePqr = async (pqrId: number) => {
        try {
            setTakingPqrId(pqrId);

            const response = await takePqr(pqrId);

            // La PQR tomada sale de disponibles.
            setAvailablePqrs((prev) => prev.filter((pqr) => pqr.id !== pqrId));

            // La PQR tomada entra en asignadas.
            setAssignedPqrs((prev) => [response.pqr, ...prev]);

            showSnackbar(response.message || "PQR tomada correctamente.", "success");
        } catch (error) {
            console.error(error);

            showSnackbar(getErrorMessage(error, "Error al tomar la PQR."), "error");
        } finally {
            setTakingPqrId(null);
        }
    };

    // Guarda temporalmente el estado seleccionado antes de enviarlo.
    const handleStatusChange = (pqrId: number, status: PqrStatus) => {
        setStatusByPqrId((prev) => ({
            ...prev,
            [pqrId]: status,
        }));
    };

    // Actualiza el estado de una PQR asignada.
    const handleUpdateStatus = async (pqrId: number) => {
        try {
            const selectedStatus = statusByPqrId[pqrId];

            if (!selectedStatus) {
                showSnackbar("Debes seleccionar un estado.", "warning");
                return;
            }

            setUpdatingStatusId(pqrId);

            const response = await updatePqrStatus(pqrId, selectedStatus);

            // Actualiza la PQR modificada dentro de la lista de asignadas.
            setAssignedPqrs((prev) =>
                prev.map((pqr) => (pqr.id === pqrId ? response.pqr : pqr))
            );

            // Limpia el cambio temporal después de guardar.
            setStatusByPqrId((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });

            showSnackbar(response.message || "Estado actualizado correctamente.");
        } catch (error) {
            console.error(error);

            showSnackbar(
                getErrorMessage(error, "Error al actualizar el estado."),
                "error"
            );
        } finally {
            setUpdatingStatusId(null);
        }
    };

    // Guarda el texto escrito en el campo de respuesta.
    const handleResponseChange = (pqrId: number, value: string) => {
        setResponseTexts((prev) => ({
            ...prev,
            [pqrId]: value,
        }));

        // Limpia el error de esa PQR mientras el usuario escribe.
        setResponseErrors((prev) => ({
            ...prev,
            [pqrId]: "",
        }));
    };

    // Envía la respuesta escrita para una PQR asignada.
    const handleRespondPqr = async (pqrId: number) => {
        try {
            const responseText = responseTexts[pqrId]?.trim();

            if (!responseText) {
                setResponseErrors((prev) => ({
                    ...prev,
                    [pqrId]: "Debes escribir una respuesta antes de enviarla.",
                }));

                return;
            }

            setRespondingPqrId(pqrId);

            const response = await respondPqr(pqrId, responseText);

            // Actualiza la PQR respondida dentro de la lista de asignadas.
            setAssignedPqrs((prev) =>
                prev.map((pqr) => (pqr.id === pqrId ? response.pqr : pqr))
            );

            // Limpia el campo de respuesta después de enviar.
            setResponseTexts((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });

            showSnackbar(response.message || "Respuesta enviada correctamente.");
        } catch (error) {
            console.error(error);

            showSnackbar(
                getErrorMessage(error, "Error al responder la PQR."),
                "error"
            );
        } finally {
            setRespondingPqrId(null);
        }
    };

    // Actualiza el texto del buscador.
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Abre o cierra el campo de búsqueda.
    const toggleSearch = () => {
        setShowSearch((prev) => !prev);
    };

    // Limpia el buscador y lo oculta.
    const clearSearch = () => {
        setSearchTerm("");
        setShowSearch(false);
    };

    // Define qué lista se debe mostrar según la vista activa.
    const currentPqrs =
        activeView === "AVAILABLE" ? availablePqrs : assignedPqrs;

    // Filtra las PQR por búsqueda y estado.
    const filteredPqrs = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase().trim();

        return currentPqrs.filter((pqr) => {
            const matchesSearch =
                !normalizedSearch ||
                pqr.description.toLowerCase().includes(normalizedSearch) ||
                pqr.caseType.toLowerCase().includes(normalizedSearch) ||
                pqr.status.toLowerCase().includes(normalizedSearch) ||
                pqr.user?.name?.toLowerCase().includes(normalizedSearch) ||
                pqr.user?.email?.toLowerCase().includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "ALL" || pqr.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [currentPqrs, searchTerm, statusFilter]);

    // Carga la información al abrir la vista.
    useEffect(() => {
        loadAgentPqrs();
    }, []);

    return {
        availablePqrs,
        assignedPqrs,
        filteredPqrs,

        loading,
        takingPqrId,
        updatingStatusId,
        respondingPqrId,

        activeView,
        setActiveView,

        statusFilter,
        setStatusFilter,

        searchTerm,
        showSearch,
        handleSearchChange,
        toggleSearch,
        clearSearch,

        statusByPqrId,
        responseTexts,
        responseErrors,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAgentPqrs,
        handleTakePqr,
        handleStatusChange,
        handleUpdateStatus,
        handleResponseChange,
        handleRespondPqr,
    };
};