import { useEffect, useState } from "react";

import {
    createPersonnelHiringConfirmation,
    decidePersonnelHiringConfirmation,
    decidePersonnelRequisition,
    getPersonnelRequisitions,
} from "../../services/humanTalent/personnelRequisitionService";

import { getErrorMessage } from "../../utils/common/getErrorMessage";

import {
    cleanNumberInput,
    formatNumberInput,
} from "../../utils/common/numberUtils";

import type {
    ApprovalDecision,
    ContractType,
    DirectContractType,
    InternContractType,
    PersonnelRequisition,
} from "../../interfaces/humanTalent/personnelRequisition.interface";
import type { MessageType } from "../../interfaces/common/message.interface";

// Estado inicial del formulario de confirmación de contratación.
const initialHiringForm = {
    contractType: "" as ContractType | "",
    directContractType: "" as DirectContractType | "",
    contractDurationMonths: "",
    internContractType: "" as InternContractType | "",
    approvedSalary: "",
};

// Tipos de decisiones que puede manejar el modal de confirmación.
type DecisionDialogType =
    | "APPROVE_REQUISITION"
    | "REJECT_REQUISITION"
    | "APPROVE_HIRING_CONFIRMATION"
    | "REJECT_HIRING_CONFIRMATION";

// Estado del modal usado para aprobar o rechazar acciones.
interface DecisionDialogState {
    open: boolean;
    type: DecisionDialogType | null;
    requisition: PersonnelRequisition | null;
}

// Hook encargado de manejar el listado, decisiones y confirmación de contratación.
export const usePersonnelRequisitions = () => {
    // Listado de requisiciones de personal.
    const [requisitions, setRequisitions] = useState<PersonnelRequisition[]>(
        []
    );

    // Controla la carga inicial del listado.
    const [loading, setLoading] = useState(false);

    // Controla el envío de una decisión o confirmación.
    const [loadingDecision, setLoadingDecision] = useState(false);

    // Id de la requisición que se está procesando.
    const [selectedRequisitionId, setSelectedRequisitionId] = useState<
        number | null
    >(null);

    // Error exclusivo al consultar el listado de requisiciones mediante GET.
    const [loadError, setLoadError] = useState("");

    // Mensaje mostrado en el CustomSnackbar.
    const [message, setMessage] = useState("");

    // Controla si se muestra el CustomSnackbar.
    const [openMessage, setOpenMessage] = useState(false);

    // Define si el Snackbar será de éxito, error, advertencia o información.
    const [messageSeverity, setMessageSeverity] =
        useState<MessageType>("success");

    // Controla el modal de confirmación de contratación.
    const [openHiringDialog, setOpenHiringDialog] = useState(false);

    // Requisición seleccionada para confirmar contratación.
    const [selectedHiringRequisition, setSelectedHiringRequisition] =
        useState<PersonnelRequisition | null>(null);

    // Formulario de confirmación de contratación.
    const [hiringForm, setHiringForm] = useState(initialHiringForm);

    // Controla el modal de decisión para aprobar o rechazar.
    const [decisionDialog, setDecisionDialog] = useState<DecisionDialogState>({
        open: false,
        type: null,
        requisition: null,
    });

    // Comentario usado cuando se rechaza una requisición o confirmación.
    const [decisionComment, setDecisionComment] = useState("");

    // Formatea un valor monetario para mostrarlo en el formulario.
    const formatMoney = (value: string | number | null | undefined) => {
        if (value === null || value === undefined) return "";

        const cleanValue = String(value).split(".")[0];

        return formatNumberInput(cleanValue);
    };

    // Obtiene la aprobación actual de la requisición.
    const getCurrentRequisitionApproval = (requisition: PersonnelRequisition) => {
        return requisition.approvals?.find((approval) => {
            return approval.isCurrent && approval.decision === null;
        });
    };

    // Obtiene la aprobación actual de la confirmación de contratación.
    const getCurrentHiringConfirmationApproval = (
        requisition: PersonnelRequisition
    ) => {
        return requisition.hiringConfirmation?.approvals?.find((approval) => {
            return approval.isCurrent && approval.decision === null;
        });
    };

    // Valida si la requisición está lista para que Talento Humano registre la confirmación.
    const canCreateHiringConfirmation = (requisition: PersonnelRequisition) => {
        return (
            requisition.status === "PENDIENTE_CONFIRMACION_TALENTO_HUMANO" &&
            !requisition.hiringConfirmation
        );
    };

    // Muestra un mensaje mediante el CustomSnackbar.
    const showMessage = (
        text: string,
        severity: MessageType = "success"
    ) => {
        setMessage(text);
        setMessageSeverity(severity);
        setOpenMessage(true);
    };

    // Carga el listado de requisiciones.
    const loadRequisitions = async () => {
        try {
            setLoading(true);
            setLoadError("");

            const response = await getPersonnelRequisitions();

            setRequisitions(response.requisitions);
        } catch (error: unknown) {
            console.error(error);

            setLoadError(
                getErrorMessage(
                    error,
                    "Error al cargar las requisiciones de personal."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // Registra una decisión sobre una requisición.
    const handleDecision = async (
        requisitionId: number,
        decision: ApprovalDecision,
        comment?: string
    ) => {
        try {
            setLoadingDecision(true);
            setSelectedRequisitionId(requisitionId);

            setMessage("");
            setOpenMessage(false);

            const response = await decidePersonnelRequisition(requisitionId, {
                decision,
                comment: comment?.trim() || null,
            });

            showMessage(
                response.message || "Decisión registrada correctamente.",
                "success"
            );

            await loadRequisitions();

            return true;
        } catch (error: unknown) {
            console.error(error);

            showMessage(
                getErrorMessage(
                    error,
                    "Error al registrar la decisión de la requisición."
                ),
                "error"
            );

            return false;
        } finally {
            setLoadingDecision(false);
            setSelectedRequisitionId(null);
        }
    };

    // Abre el modal para registrar la confirmación de contratación.
    const openCreateHiringDialog = (requisition: PersonnelRequisition) => {
        setSelectedHiringRequisition(requisition);

        setHiringForm({
            contractType: requisition.contractType || "",
            directContractType: requisition.directContractType || "",
            contractDurationMonths: requisition.contractDurationMonths
                ? String(requisition.contractDurationMonths)
                : "",
            internContractType: requisition.internContractType || "",
            approvedSalary: requisition.proposedSalary
                ? formatMoney(requisition.proposedSalary)
                : "",
        });

        setOpenHiringDialog(true);
    };

    // Limpia y cierra internamente el modal de contratación.
    const resetHiringDialog = () => {
        setOpenHiringDialog(false);
        setSelectedHiringRequisition(null);
        setHiringForm(initialHiringForm);
    };

    // Cierra el modal de confirmación de contratación.
    const closeCreateHiringDialog = () => {
        if (loadingDecision) return;

        resetHiringDialog();
    };

    // Actualiza los campos del formulario de confirmación.
    const handleHiringFormChange = (
        field: keyof typeof initialHiringForm,
        value: string
    ) => {
        setHiringForm((prev) => {
            if (field === "contractType") {
                return {
                    ...prev,
                    contractType: value as ContractType | "",
                    directContractType: "",
                    contractDurationMonths: "",
                    internContractType: "",
                };
            }

            if (field === "directContractType") {
                return {
                    ...prev,
                    directContractType: value as DirectContractType | "",
                    contractDurationMonths:
                        value === "FIJO" ? prev.contractDurationMonths : "",
                };
            }

            return {
                ...prev,
                [field]: value,
            };
        });
    };


    // Valida si el formulario de confirmación está listo para enviar.
    const isHiringFormValid = () => {
        if (!hiringForm.contractType) return false;
        if (!cleanNumberInput(hiringForm.approvedSalary)) return false;

        if (
            hiringForm.contractType === "DIRECTO" &&
            !hiringForm.directContractType
        ) {
            return false;
        }

        if (
            hiringForm.contractType === "DIRECTO" &&
            hiringForm.directContractType === "FIJO" &&
            !hiringForm.contractDurationMonths
        ) {
            return false;
        }

        if (
            hiringForm.contractType === "TEMPORAL" &&
            !hiringForm.contractDurationMonths
        ) {
            return false;
        }

        if (
            hiringForm.contractType === "PRACTICANTE" &&
            !hiringForm.internContractType
        ) {
            return false;
        }

        return true;
    };

    // Registra la confirmación final de contratación de una requisición.
    const confirmCreateHiringConfirmation = async () => {
        if (!selectedHiringRequisition || !hiringForm.contractType) return;

        try {
            setLoadingDecision(true);
            setSelectedRequisitionId(selectedHiringRequisition.id);

            setMessage("");
            setOpenMessage(false);

            const response = await createPersonnelHiringConfirmation(
                selectedHiringRequisition.id,
                {
                    contractType: hiringForm.contractType,
                    directContractType:
                        hiringForm.contractType === "DIRECTO" &&
                            hiringForm.directContractType
                            ? hiringForm.directContractType
                            : null,
                    contractDurationMonths: hiringForm.contractDurationMonths
                        ? Number(hiringForm.contractDurationMonths)
                        : null,
                    internContractType:
                        hiringForm.contractType === "PRACTICANTE" &&
                            hiringForm.internContractType
                            ? hiringForm.internContractType
                            : null,
                    approvedSalary: Number(
                        cleanNumberInput(hiringForm.approvedSalary)
                    ),
                }
            );

            showMessage(
                response.message ||
                "Confirmación de contratación registrada correctamente.",
                "success"
            );

            // Se utiliza resetHiringDialog porque loadingDecision todavía es true.
            resetHiringDialog();

            await loadRequisitions();
        } catch (error: unknown) {
            console.error(error);

            showMessage(
                getErrorMessage(
                    error,
                    "Error al registrar la confirmación de contratación."
                ),
                "error"
            );
        } finally {
            setLoadingDecision(false);
            setSelectedRequisitionId(null);
        }
    };

    // Registra la decisión del Jefe de Talento Humano sobre la confirmación.
    const handleHiringConfirmationDecision = async (
        hiringConfirmationId: number,
        requisitionId: number,
        decision: ApprovalDecision,
        comment?: string
    ) => {
        try {
            setLoadingDecision(true);
            setSelectedRequisitionId(requisitionId);

            setMessage("");
            setOpenMessage(false);

            const response = await decidePersonnelHiringConfirmation(
                hiringConfirmationId,
                {
                    decision,
                    comment: comment?.trim() || null,
                }
            );

            showMessage(
                response.message ||
                "Decisión de Talento Humano registrada correctamente.",
                "success"
            );

            await loadRequisitions();

            return true;
        } catch (error: unknown) {
            console.error(error);

            showMessage(
                getErrorMessage(
                    error,
                    "Error al registrar la decisión de Talento Humano."
                ),
                "error"
            );

            return false;
        } finally {
            setLoadingDecision(false);
            setSelectedRequisitionId(null);
        }
    };

    // Abre el modal para aprobar una requisición.
    const openApproveRequisitionDialog = (requisition: PersonnelRequisition) => {
        setDecisionComment("");
        setDecisionDialog({
            open: true,
            type: "APPROVE_REQUISITION",
            requisition,
        });
    };

    // Abre el modal para rechazar una requisición.
    const openRejectRequisitionDialog = (requisition: PersonnelRequisition) => {
        setDecisionComment("");
        setDecisionDialog({
            open: true,
            type: "REJECT_REQUISITION",
            requisition,
        });
    };

    // Abre el modal para aprobar una confirmación de contratación.
    const openApproveHiringConfirmationDialog = (
        requisition: PersonnelRequisition
    ) => {
        setDecisionComment("");
        setDecisionDialog({
            open: true,
            type: "APPROVE_HIRING_CONFIRMATION",
            requisition,
        });
    };

    // Abre el modal para rechazar una confirmación de contratación.
    const openRejectHiringConfirmationDialog = (
        requisition: PersonnelRequisition
    ) => {
        setDecisionComment("");
        setDecisionDialog({
            open: true,
            type: "REJECT_HIRING_CONFIRMATION",
            requisition,
        });
    };

    // Cierra el modal de decisión.
    const closeDecisionDialog = () => {
        if (loadingDecision) return;

        setDecisionDialog({
            open: false,
            type: null,
            requisition: null,
        });
        setDecisionComment("");
    };

    // Confirma la acción seleccionada dentro del modal de decisión.
    const confirmDecisionDialog = async () => {
        if (!decisionDialog.requisition || !decisionDialog.type) return;

        let success = false;

        if (decisionDialog.type === "APPROVE_REQUISITION") {
            success = await handleDecision(
                decisionDialog.requisition.id,
                "APROBADA"
            );
        }

        if (decisionDialog.type === "REJECT_REQUISITION") {
            success = await handleDecision(
                decisionDialog.requisition.id,
                "RECHAZADA",
                decisionComment
            );
        }

        if (decisionDialog.type === "APPROVE_HIRING_CONFIRMATION") {
            const hiringConfirmationId =
                decisionDialog.requisition.hiringConfirmation?.id;

            if (!hiringConfirmationId) {
                showMessage(
                    "La requisición no tiene confirmación de contratación.",
                    "error"
                );
                return;
            }

            success = await handleHiringConfirmationDecision(
                hiringConfirmationId,
                decisionDialog.requisition.id,
                "APROBADA"
            );
        }

        if (decisionDialog.type === "REJECT_HIRING_CONFIRMATION") {
            const hiringConfirmationId =
                decisionDialog.requisition.hiringConfirmation?.id;

            if (!hiringConfirmationId) {
                showMessage(
                    "La requisición no tiene confirmación de contratación.",
                    "error"
                );
                return;
            }

            success = await handleHiringConfirmationDecision(
                hiringConfirmationId,
                decisionDialog.requisition.id,
                "RECHAZADA",
                decisionComment
            );
        }

        if (success) {
            closeDecisionDialog();
        }
    };

    // Cierra el mensaje visual.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Carga las requisiciones al iniciar el hook.
    useEffect(() => {
        loadRequisitions();
    }, []);

    return {
        requisitions,

        loading,
        loadingDecision,
        selectedRequisitionId,

        loadError,
        message,
        openMessage,
        messageSeverity,

        openHiringDialog,
        selectedHiringRequisition,
        hiringForm,

        decisionDialog,
        decisionComment,

        loadRequisitions,
        handleDecision,
        openCreateHiringDialog,
        closeCreateHiringDialog,
        handleHiringFormChange,
        isHiringFormValid,
        confirmCreateHiringConfirmation,
        handleHiringConfirmationDecision,

        setDecisionComment,
        openApproveRequisitionDialog,
        openRejectRequisitionDialog,
        openApproveHiringConfirmationDialog,
        openRejectHiringConfirmationDialog,
        closeDecisionDialog,
        confirmDecisionDialog,

        getCurrentRequisitionApproval,
        getCurrentHiringConfirmationApproval,
        canCreateHiringConfirmation,

        closeMessage,
    };
};