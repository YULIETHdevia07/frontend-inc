import { useEffect, useState } from "react";
import type {
    MessageType,
    Pqr,
    PqrPriority,
    PqrStatus,
} from "../../interfaces/pqrs/pqr.interface";
import type { User } from "../../interfaces/users/user.interface";
import {
    assignPqr,
    getAllPqrs,
    updatePqrPriority,
    updatePqrStatus,
} from "../../services/pqrs/pqrService";
import { getAgents } from "../../services/users/userService";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

// Hook encargado de manejar la lógica administrativa de PQR.
export const useAdminPqrs = () => {
    // Lista de todas las PQR del sistema.
    const [pqrs, setPqrs] = useState<Pqr[]>([]);

    // Lista de agentes disponibles para asignar o reasignar PQR.
    const [agents, setAgents] = useState<User[]>([]);

    // Controla la carga inicial de la vista.
    const [loading, setLoading] = useState(true);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Guarda el id de la PQR cuyo estado se está actualizando.
    const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(
        null
    );

    // Guarda el id de la PQR cuya prioridad se está actualizando.
    const [updatingPriorityId, setUpdatingPriorityId] = useState<number | null>(
        null
    );

    // Guarda el id de la PQR que se está asignando o reasignando.
    const [assigningPqrId, setAssigningPqrId] = useState<number | null>(null);


    // Guarda temporalmente los estados seleccionados.
    const [statusChanges, setStatusChanges] = useState<Record<number, PqrStatus>>(
        {}
    );

    // Guarda temporalmente las prioridades seleccionadas.
    const [priorityChanges, setPriorityChanges] = useState<
        Record<number, PqrPriority>
    >({});

    // Guarda temporalmente el agente seleccionado para cada PQR.
    const [agentChanges, setAgentChanges] = useState<Record<number, number>>({});

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

    // Carga todas las PQR y los agentes para el administrador.
    const loadAllPqrs = async () => {
        try {
            setLoading(true);
            setError("");

            const [pqrsResponse, agentsResponse] = await Promise.all([
                getAllPqrs(),
                getAgents(),
            ]);

            setPqrs(pqrsResponse.pqrs);
            setAgents(agentsResponse.agents);
        } catch (error) {
            console.error(error);

            setError(
                "Error al cargar las PQR. Verifica que el usuario tenga rol ADMIN."
            );
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
            showSnackbar("Debes seleccionar un estado.", "warning");
            return;
        }

        try {
            setUpdatingStatusId(pqrId);

            const response = await updatePqrStatus(pqrId, newStatus);

            // Actualiza inmediatamente la PQR modificada sin recargar toda la vista.
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
                getErrorMessage(
                    error,
                    "Error al actualizar el estado de la PQR."
                ),
                "error"
            );
        } finally {
            setUpdatingStatusId(null);
        }
    };

    // Guarda la prioridad seleccionada de una PQR.
    const handlePriorityChange = (pqrId: number, priority: string) => {
        setPriorityChanges((prev) => {
            const updated = { ...prev };

            if (!priority) {
                delete updated[pqrId];
                return updated;
            }

            updated[pqrId] = priority as PqrPriority;
            return updated;
        });
    };

    // Actualiza la prioridad de una PQR.
    const handleUpdatePriority = async (pqrId: number) => {
        const newPriority = priorityChanges[pqrId];

        if (!newPriority) {
            showSnackbar("Debes seleccionar una prioridad.", "warning");
            return;
        }

        try {
            setUpdatingPriorityId(pqrId);

            const response = await updatePqrPriority(pqrId, newPriority);

            setPqrs((prev) =>
                prev.map((pqr) =>
                    pqr.id === pqrId
                        ? {
                            ...pqr,
                            ...response.pqr,
                            priority: newPriority,
                        }
                        : pqr
                )
            );

            setPriorityChanges((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });

            showSnackbar(
                response.message || "Prioridad actualizada correctamente.",
                "success"
            );
        } catch (error) {
            console.error(error);

            showSnackbar(
                getErrorMessage(error, "Error al actualizar la prioridad."),
                "error"
            );
        } finally {
            setUpdatingPriorityId(null);
        }
    };

    // Guarda el agente seleccionado para una PQR.
    const handleAgentChange = (pqrId: number, agentId: string) => {
        setAgentChanges((prev) => {
            const updated = { ...prev };

            if (!agentId) {
                delete updated[pqrId];
                return updated;
            }

            updated[pqrId] = Number(agentId);
            return updated;
        });
    };

    // Asigna o reasigna una PQR a un agente.
    const handleAssignPqr = async (pqrId: number) => {
        const agentId = agentChanges[pqrId];

        if (!agentId) {
            showSnackbar("Debes seleccionar un agente.", "warning");
            return;
        }

        try {
            setAssigningPqrId(pqrId);

            const response = await assignPqr(pqrId, agentId);

            setPqrs((prev) =>
                prev.map((pqr) =>
                    pqr.id === pqrId
                        ? {
                            ...pqr,
                            ...response.pqr,
                        }
                        : pqr
                )
            );

            setAgentChanges((prev) => {
                const updated = { ...prev };
                delete updated[pqrId];
                return updated;
            });

            showSnackbar(
                response.message || "Responsable actualizado correctamente.",
                "success"
            );
        } catch (error) {
            console.error(error);

            showSnackbar(
                getErrorMessage(
                    error,
                    "Error al asignar o reasignar la PQR."
                ),
                "error"
            );
        } finally {
            setAssigningPqrId(null);
        }
    };


    // Carga las PQR cuando se abre la vista.
    useEffect(() => {
        loadAllPqrs();
    }, []);

    return {
        pqrs,
        agents,
        loading,
        error,

        updatingStatusId,
        updatingPriorityId,
        assigningPqrId,

        statusChanges,
        priorityChanges,
        agentChanges,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAllPqrs,
        handleStatusChange,
        handleUpdateStatus,
        handlePriorityChange,
        handleUpdatePriority,
        handleAgentChange,
        handleAssignPqr,
    };
};