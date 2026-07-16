import { useEffect, useState } from "react";

import { getPersonnelRequisitionById } from "../../services/humanTalent/personnelRequisitionService";

import { getErrorMessage } from "../../utils/common/getErrorMessage";

import type { PersonnelRequisition } from "../../interfaces/humanTalent/personnelRequisition.interface";

// Hook encargado de cargar el detalle de una requisición de personal.
export const usePersonnelRequisitionDetail = (requisitionId: number) => {
    // Detalle de la requisición seleccionada.
    const [requisition, setRequisition] =
        useState<PersonnelRequisition | null>(null);

    // Controla la carga del detalle.
    const [loading, setLoading] = useState(false);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Carga el detalle completo de una requisición.
    const loadRequisitionDetail = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPersonnelRequisitionById(requisitionId);

            setRequisition(response.requisition);
        } catch (error: unknown) {
            console.error(error);
            setError(
                getErrorMessage(
                    error,
                    "Error al cargar el detalle de la requisición."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // Carga el detalle cuando cambia el id de la requisición.
    useEffect(() => {
        if (requisitionId) {
            loadRequisitionDetail();
        }
    }, [requisitionId]);

    return {
        requisition,
        loading,
        error,
        loadRequisitionDetail,
    };
};