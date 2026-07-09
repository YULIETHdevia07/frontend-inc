import {
    Box,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import type { ChipProps } from "@mui/material";

import ActionButton from "../common/ActionButton";

import type {
    PersonnelRequisition,
    RequisitionStatus,
} from "../../interfaces/humanTalent/personnelRequisition.interface";

interface PersonnelRequisitionListItemProps {
    requisition: PersonnelRequisition;
    loading?: boolean;

    canDecideRequisition?: boolean;
    canCreateHiringConfirmation?: boolean;
    canDecideHiringConfirmation?: boolean;

    onApproveRequisition?: (requisition: PersonnelRequisition) => void;
    onRejectRequisition?: (requisition: PersonnelRequisition) => void;
    onCreateHiringConfirmation?: (requisition: PersonnelRequisition) => void;
    onApproveHiringConfirmation?: (requisition: PersonnelRequisition) => void;
    onRejectHiringConfirmation?: (requisition: PersonnelRequisition) => void;
}

// Muestra una requisición de personal en formato de lista.
const PersonnelRequisitionListItem = ({
    requisition,
    loading = false,
    canDecideRequisition = false,
    canCreateHiringConfirmation = false,
    canDecideHiringConfirmation = false,
    onApproveRequisition,
    onRejectRequisition,
    onCreateHiringConfirmation,
    onApproveHiringConfirmation,
    onRejectHiringConfirmation,
}: PersonnelRequisitionListItemProps) => {
    const formatMoney = (value: string | number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    const formatDate = (value: string) => {
        return new Date(value).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusLabel = (status: RequisitionStatus) => {
        const labels: Record<RequisitionStatus, string> = {
            EN_APROBACION: "En aprobación",
            PENDIENTE_CONFIRMACION_TALENTO_HUMANO:
                "Pendiente confirmación TH",
            PENDIENTE_APROBACION_TALENTO_HUMANO:
                "Pendiente aprobación TH",
            APROBADA: "Aprobada",
            RECHAZADA: "Rechazada",
            CANCELADA: "Cancelada",
        };

        return labels[status];
    };

    const getStatusColor = (
        status: RequisitionStatus
    ): ChipProps["color"] => {
        if (status === "APROBADA") return "success";
        if (status === "RECHAZADA" || status === "CANCELADA") return "error";

        return "warning";
    };

    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: {
                    xs: 2,
                    md: 2.5,
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    gap: 2,
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                }}
            >
                <Box sx={{ width: "100%" }}>
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1}
                        sx={{
                            mb: 1,
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                color: "text.primary",
                            }}
                        >
                            {requisition.position?.name}
                        </Typography>

                        <Chip
                            label={getStatusLabel(requisition.status)}
                            color={getStatusColor(requisition.status)}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            mb: 1,
                        }}
                    >
                        Área: {requisition.department?.name} · Ciudad:{" "}
                        {requisition.city?.name}
                    </Typography>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={{
                            xs: 0.5,
                            sm: 2,
                        }}
                    >
                        <Typography variant="body2">
                            <strong>Salario:</strong>{" "}
                            {formatMoney(requisition.proposedSalary)}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Contrato:</strong>{" "}
                            {requisition.contractType}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Fecha:</strong>{" "}
                            {formatDate(requisition.requestDate)}
                        </Typography>
                    </Stack>

                    {requisition.createdBy && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                mt: 1,
                            }}
                        >
                            Solicitado por: {requisition.createdBy.name}
                        </Typography>
                    )}
                    {requisition.approvals?.some(
                        (approval) => approval.isCurrent && approval.decision === null
                    ) && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    mt: 1,
                                }}
                            >
                                Pendiente por:{" "}
                                {
                                    requisition.approvals.find(
                                        (approval) =>
                                            approval.isCurrent && approval.decision === null
                                    )?.approverUser?.name
                                }
                            </Typography>
                        )}

                    {requisition.hiringConfirmation?.approvals?.some(
                        (approval) => approval.isCurrent && approval.decision === null
                    ) && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    mt: 1,
                                }}
                            >
                                Pendiente TH por:{" "}
                                {
                                    requisition.hiringConfirmation.approvals.find(
                                        (approval) =>
                                            approval.isCurrent && approval.decision === null
                                    )?.approverUser?.name
                                }
                            </Typography>
                        )}
                </Box>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1}
                    sx={{
                        width: {
                            xs: "100%",
                            md: "auto",
                        },
                        justifyContent: "flex-end",
                    }}
                >
                    {canDecideRequisition && (
                        <>
                            <ActionButton
                                actionType="approve"
                                loading={loading}
                                loadingText="Aprobando..."
                                iconOnlyOnMobile
                                tooltip="Aprobar requisición"
                                onClick={() =>
                                    onApproveRequisition?.(requisition)
                                }
                            >
                                Aprobar
                            </ActionButton>

                            <ActionButton
                                actionType="reject"
                                loading={loading}
                                loadingText="Rechazando..."
                                iconOnlyOnMobile
                                tooltip="Rechazar requisición"
                                onClick={() =>
                                    onRejectRequisition?.(requisition)
                                }
                            >
                                Rechazar
                            </ActionButton>
                        </>
                    )}

                    {canCreateHiringConfirmation && (
                        <ActionButton
                            actionType="save"
                            loading={loading}
                            loadingText="Guardando..."
                            fullWidthOnMobile
                            tooltip="Confirmar contratación"
                            onClick={() =>
                                onCreateHiringConfirmation?.(requisition)
                            }
                        >
                            Confirmar contratación
                        </ActionButton>
                    )}

                    {canDecideHiringConfirmation && (
                        <>
                            <ActionButton
                                actionType="approve"
                                loading={loading}
                                loadingText="Aprobando..."
                                iconOnlyOnMobile
                                tooltip="Aprobar confirmación"
                                onClick={() =>
                                    onApproveHiringConfirmation?.(requisition)
                                }
                            >
                                Aprobar TH
                            </ActionButton>

                            <ActionButton
                                actionType="reject"
                                loading={loading}
                                loadingText="Rechazando..."
                                iconOnlyOnMobile
                                tooltip="Rechazar confirmación"
                                onClick={() =>
                                    onRejectHiringConfirmation?.(requisition)
                                }
                            >
                                Rechazar TH
                            </ActionButton>
                        </>
                    )}
                </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
                variant="caption"
                sx={{
                    color: "text.secondary",
                }}
            >
                Código requisición #{requisition.id}
            </Typography>
        </Paper>
    );
};

export default PersonnelRequisitionListItem;