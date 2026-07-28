import { Alert, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import EmptyState from "../../components/common/EmptyState";
import ConfirmActionDialog from "../../components/common/ConfirmActionDialog";

import PersonnelRequisitionListItem from "../../components/humanTalent/PersonnelRequisitionListItem";
import PersonnelHiringConfirmationDialog from "../../components/humanTalent/PersonnelHiringConfirmationDialog";

import { usePersonnelRequisitions } from "../../hooks/humanTalent/usePersonnelRequisitions";
import { useAuth } from "../../context/AuthContext";

import type { PersonnelRequisition } from "../../interfaces/humanTalent/personnelRequisition.interface";

// Página para listar, aprobar, rechazar y confirmar requisiciones de personal.
const PersonnelRequisitions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const {
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

        openCreateHiringDialog,
        closeCreateHiringDialog,
        handleHiringFormChange,
        isHiringFormValid,
        confirmCreateHiringConfirmation,

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
    } = usePersonnelRequisitions();

    // Valida si el usuario puede aprobar o rechazar la requisición actual.
    const canDecideRequisition = (requisition: PersonnelRequisition) => {
        const currentApproval = getCurrentRequisitionApproval(requisition);

        return currentApproval?.approverUserId === user?.id;
    };

    // Valida si el usuario puede aprobar o rechazar la confirmación de contratación actual.
    const canDecideHiringConfirmation = (requisition: PersonnelRequisition) => {
        const currentApproval = getCurrentHiringConfirmationApproval(requisition);

        return currentApproval?.approverUserId === user?.id;
    };

    // Valida si el usuario tiene un cargo activo específico.
    const userHasPosition = (positionCode: string) => {
        return user?.positions?.some((position) => position.code === positionCode);
    };

    // Valida si el usuario puede registrar la confirmación de contratación.
    const canCreateHiringConfirmationForUser = (
        requisition: PersonnelRequisition
    ) => {
        return (
            userHasPosition("DPC-TH-0080") &&
            canCreateHiringConfirmation(requisition)
        );
    };

    // Devuelve el título del modal de decisión.
    const getDecisionDialogTitle = () => {
        if (decisionDialog.type === "APPROVE_REQUISITION") {
            return "Aprobar requisición";
        }

        if (decisionDialog.type === "REJECT_REQUISITION") {
            return "Rechazar requisición";
        }

        if (decisionDialog.type === "APPROVE_HIRING_CONFIRMATION") {
            return "Aprobar confirmación de contratación";
        }

        if (decisionDialog.type === "REJECT_HIRING_CONFIRMATION") {
            return "Rechazar confirmación de contratación";
        }

        return "Confirmar acción";
    };

    // Devuelve el mensaje del modal de decisión.
    const getDecisionDialogMessage = () => {
        if (
            decisionDialog.type === "APPROVE_REQUISITION" ||
            decisionDialog.type === "APPROVE_HIRING_CONFIRMATION"
        ) {
            return "¿Está seguro de aprobar este proceso?";
        }

        return "Ingrese el motivo del rechazo para continuar.";
    };

    // Valida si la decisión requiere comentario.
    const isCommentRequired = () => {
        return (
            decisionDialog.type === "REJECT_REQUISITION" ||
            decisionDialog.type === "REJECT_HIRING_CONFIRMATION"
        );
    };

    // Valida si la acción del modal es de aprobación.
    const isApproveAction = () => {
        return (
            decisionDialog.type === "APPROVE_REQUISITION" ||
            decisionDialog.type === "APPROVE_HIRING_CONFIRMATION"
        );
    };

    // Navega al detalle de una requisición.
    const goToRequisitionDetail = (requisitionId: number) => {
        navigate(`/dashboard/human-talent/requisitions/${requisitionId}`);
    };

    return (
        <PageContainer>
            <PageHeader
                title="Requisiciones de personal"
                subtitle="Consulta, aprueba, rechaza o confirma requisiciones según el proceso."
            />

            {loadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {loadError}
                </Alert>
            )}

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : requisitions.length === 0 ? (
                <EmptyState title="No hay requisiciones de personal registradas." />
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {requisitions.map((requisition) => (
                        <PersonnelRequisitionListItem
                            key={requisition.id}
                            requisition={requisition}
                            loading={
                                loadingDecision &&
                                selectedRequisitionId === requisition.id
                            }
                            canDecideRequisition={canDecideRequisition(
                                requisition
                            )}
                            canCreateHiringConfirmation={canCreateHiringConfirmationForUser(
                                requisition
                            )}
                            canDecideHiringConfirmation={canDecideHiringConfirmation(
                                requisition
                            )}
                            onApproveRequisition={
                                openApproveRequisitionDialog
                            }
                            onRejectRequisition={
                                openRejectRequisitionDialog
                            }
                            onCreateHiringConfirmation={
                                openCreateHiringDialog
                            }
                            onApproveHiringConfirmation={
                                openApproveHiringConfirmationDialog
                            }
                            onRejectHiringConfirmation={
                                openRejectHiringConfirmationDialog
                            }
                            onViewDetail={goToRequisitionDetail}
                        />
                    ))}
                </Box>
            )}

            <ConfirmActionDialog
                open={decisionDialog.open}
                title={getDecisionDialogTitle()}
                message={getDecisionDialogMessage()}
                actionType={isApproveAction() ? "approve" : "reject"}
                confirmText={isApproveAction() ? "Aprobar" : "Rechazar"}
                loading={loadingDecision}
                infoContent={
                    decisionDialog.requisition
                        ? `${decisionDialog.requisition.position.name} - ${decisionDialog.requisition.department.name}`
                        : undefined
                }
                commentLabel={isCommentRequired() ? "Comentario" : undefined}
                commentValue={decisionComment}
                commentRequired={isCommentRequired()}
                onCommentChange={setDecisionComment}
                onClose={closeDecisionDialog}
                onConfirm={confirmDecisionDialog}
            />

            <PersonnelHiringConfirmationDialog
                open={openHiringDialog}
                loading={loadingDecision}
                requisition={selectedHiringRequisition}
                form={hiringForm}
                isValid={isHiringFormValid()}
                onChange={handleHiringFormChange}
                onClose={closeCreateHiringDialog}
                onConfirm={confirmCreateHiringConfirmation}
            />

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity={messageSeverity}
                onClose={closeMessage}
            />
        </PageContainer>
    );
};

export default PersonnelRequisitions;