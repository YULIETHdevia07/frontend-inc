import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import ActionButton from "../../components/common/ActionButton";

import { usePersonnelRequisitionDetail } from "../../hooks/humanTalent/usePersonnelRequisitionDetail";

import type {
    PersonnelHiringConfirmationApproval,
    PersonnelRequisitionApproval,
} from "../../interfaces/humanTalent/personnelRequisition.interface";

import { formatDate } from "../../utils/common/dateUtils";
import { getOptionLabel } from "../../utils/common/formatText";
import { formatMoney } from "../../utils/common/numberUtils";

import {
    contractTypeOptions,
    directContractTypeOptions,
    internContractTypeOptions,
    requisitionReasonOptions,
} from "../../data/humanTalentOptions";

// Página que muestra el detalle completo de una requisición de personal.
const PersonnelRequisitionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const requisitionId = Number(id);

    const {
        requisition,
        loading,
        error,
    } = usePersonnelRequisitionDetail(requisitionId);

    // Valida si un valor contiene información.
    const hasValue = (
        value?: string | number | null
    ): boolean => {
        return (
            value !== null &&
            value !== undefined &&
            value !== ""
        );
    };

    // Formatea valores monetarios únicamente cuando existen.
    const formatOptionalMoney = (
        value?: string | number | null
    ): string => {
        if (!hasValue(value)) return "";

        return formatMoney(value as string | number);
    };

    const handleRequisitions = () => {
        navigate(
            `/dashboard/human-talent/requisitions`
        );
    };

    // Abre la página del formato.
    const handlePrint = () => {
        navigate(
            `/dashboard/human-talent/requisitions/${requisitionId}/format?print=1`
        );
    };

    // Muestra un elemento informativo cuando tiene valor.
    const InfoItem = ({
        label,
        value,
    }: {
        label: string;
        value?: string | number | null;
    }) => {
        if (!hasValue(value)) return null;

        return (
            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        mt: 0.4,
                    }}
                >
                    {value}
                </Typography>
            </Box>
        );
    };

    // Muestra una aprobación o firma.
    const ApprovalCard = ({
        title,
        approval,
    }: {
        title: string;
        approval?:
        | PersonnelRequisitionApproval
        | PersonnelHiringConfirmationApproval;
    }) => {
        const signatureUrl =
            approval?.decidedBy?.signatureUrl;

        const approverName =
            approval?.decidedBy?.name ||
            approval?.approverUser?.name;

        const positionName =
            approval?.approverPosition?.name ||
            title;

        return (
            <Paper
                elevation={0}
                sx={{
                    minHeight: "210px",
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    backgroundColor: "#fff",
                }}
            >
                <Stack
                    spacing={1.2}
                    sx={{
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            height: "90px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {signatureUrl ? (
                            <Box
                                component="img"
                                src={signatureUrl}
                                alt={`Firma ${approverName || ""}`}
                                sx={{
                                    maxWidth: "210px",
                                    maxHeight: "80px",
                                    objectFit: "contain",
                                }}
                            />
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    fontStyle: "italic",
                                }}
                            >
                                Pendiente de firma
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            width: "80%",
                            pt: 1,
                            borderTop: "1px solid",
                            borderColor: "text.primary",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {positionName}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.3,
                            }}
                        >
                            {approverName ||
                                "Pendiente por aprobar"}
                        </Typography>

                        {approval?.decidedAt && (
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    mt: 0.3,
                                    color: "text.secondary",
                                }}
                            >
                                Fecha:{" "}
                                {formatDate(
                                    approval.decidedAt
                                )}
                            </Typography>
                        )}
                    </Box>

                    {approval?.comment && (
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 0.8,
                                color: "text.secondary",
                            }}
                        >
                            Comentario: {approval.comment}
                        </Typography>
                    )}
                </Stack>
            </Paper>
        );
    };

    if (loading) {
        return (
            <PageContainer>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6,
                    }}
                >
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Alert severity="error">
                    {error}
                </Alert>
            </PageContainer>
        );
    }

    if (!requisition) {
        return (
            <PageContainer>
                <Alert severity="info">
                    No se encontró la requisición solicitada.
                </Alert>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title={`Detalle de requisición #${requisition.id}`}
                subtitle="Consulta la información de la requisición, sus aprobaciones y la confirmación de Talento Humano."
                actions={
                    <>
                        <ActionButton
                            actionType="back"
                            tooltip="Volver"
                            iconOnlyOnMobile
                            onClick={handleRequisitions}
                        >

                        </ActionButton>
                        <ActionButton
                            actionType="view"
                            tooltip="Generar formato"
                            fullWidthOnMobile
                            onClick={handlePrint}
                        >
                            Ver formato imprimible
                        </ActionButton>
                    </>

                }
            />

            <Stack spacing={2.5}>
                <SectionCard
                    title="Información general"
                    subtitle="Datos principales de la requisición."
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        <InfoItem
                            label="Fecha solicitante"
                            value={formatDate(
                                requisition.requestDate
                            )}
                        />

                        <InfoItem
                            label="Departamento o área solicitante"
                            value={
                                requisition.department?.name
                            }
                        />

                        <InfoItem
                            label="Cargo requerido"
                            value={
                                requisition.position?.name
                            }
                        />

                        <InfoItem
                            label="Código perfil de cargo"
                            value={
                                requisition.position?.code
                            }
                        />

                        <InfoItem
                            label="Ciudad de labores"
                            value={requisition.city?.name}
                        />

                        <InfoItem
                            label="Solicitado por"
                            value={
                                requisition.createdBy?.name
                            }
                        />

                        <InfoItem
                            label="Motivo"
                            value={getOptionLabel(
                                requisition.reason,
                                requisitionReasonOptions
                            )}
                        />

                        <InfoItem
                            label="Otro motivo"
                            value={requisition.otherReason}
                        />
                    </Box>
                </SectionCard>

                <SectionCard title="Requerimientos de contratación">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        <InfoItem
                            label="Tipo de contratación"
                            value={getOptionLabel(
                                requisition.contractType,
                                contractTypeOptions
                            )}
                        />

                        <InfoItem
                            label="Tipo de contrato"
                            value={getOptionLabel(
                                requisition.directContractType,
                                directContractTypeOptions
                            )}
                        />

                        <InfoItem
                            label="Duración"
                            value={
                                requisition.contractDurationMonths
                                    ? `${requisition.contractDurationMonths} meses`
                                    : null
                            }
                        />

                        <InfoItem
                            label="Tipo practicante"
                            value={getOptionLabel(
                                requisition.internContractType,
                                internContractTypeOptions
                            )}
                        />

                        <InfoItem
                            label="Salario propuesto"
                            value={formatOptionalMoney(
                                requisition.proposedSalary
                            )}
                        />
                    </Box>
                </SectionCard>

                <SectionCard title="Aprobaciones de requisición">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        {requisition.approvals?.map(
                            (approval) => (
                                <ApprovalCard
                                    key={approval.id}
                                    title={
                                        approval
                                            .approverPosition
                                            ?.name ||
                                        `Aprobación ${approval.approvalOrder}`
                                    }
                                    approval={approval}
                                />
                            )
                        )}
                    </Box>
                </SectionCard>

                {requisition.hiringConfirmation && (
                    <SectionCard title="Confirmación de contratación">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(4, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            <InfoItem
                                label="Tipo de contratación"
                                value={getOptionLabel(
                                    requisition
                                        .hiringConfirmation
                                        .contractType,
                                    contractTypeOptions
                                )}
                            />

                            <InfoItem
                                label="Tipo de contrato"
                                value={getOptionLabel(
                                    requisition
                                        .hiringConfirmation
                                        .directContractType,
                                    directContractTypeOptions
                                )}
                            />

                            <InfoItem
                                label="Duración"
                                value={
                                    requisition
                                        .hiringConfirmation
                                        .contractDurationMonths
                                        ? `${requisition.hiringConfirmation.contractDurationMonths} meses`
                                        : null
                                }
                            />

                            <InfoItem
                                label="Tipo practicante"
                                value={getOptionLabel(
                                    requisition
                                        .hiringConfirmation
                                        .internContractType,
                                    internContractTypeOptions
                                )}
                            />

                            <InfoItem
                                label="Salario aprobado"
                                value={formatOptionalMoney(
                                    requisition
                                        .hiringConfirmation
                                        .approvedSalary
                                )}
                            />

                            <InfoItem
                                label="Confirmado por"
                                value={
                                    requisition
                                        .hiringConfirmation
                                        .createdBy?.name
                                }
                            />

                            <InfoItem
                                label="Estado de confirmación"
                                value={
                                    requisition
                                        .hiringConfirmation
                                        .status
                                }
                            />
                        </Box>
                    </SectionCard>
                )}

                {requisition.hiringConfirmation && (
                    <SectionCard title="VoBo Talento Humano">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {requisition
                                .hiringConfirmation
                                .approvals?.map(
                                    (approval) => (
                                        <ApprovalCard
                                            key={approval.id}
                                            title={
                                                approval
                                                    .approverPosition
                                                    ?.name ||
                                                `VoBo ${approval.approvalOrder}`
                                            }
                                            approval={approval}
                                        />
                                    )
                                )}
                        </Box>
                    </SectionCard>
                )}
            </Stack>
        </PageContainer>
    );
};

export default PersonnelRequisitionDetail;