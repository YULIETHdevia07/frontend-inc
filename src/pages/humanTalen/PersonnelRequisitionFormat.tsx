import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    GlobalStyles,
    Stack,
    Typography,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import { usePersonnelRequisitionDetail } from "../../hooks/humanTalent/usePersonnelRequisitionDetail";

import type {
    ContractType,
    PersonnelHiringConfirmationApproval,
    PersonnelRequisitionApproval,
    RequisitionReason,
} from "../../interfaces/humanTalent/personnelRequisition.interface";

import { appBrand } from "../../data/appBrand";

import {
    internContractTypeOptions,
} from "../../data/humanTalentOptions";

import { formatDate } from "../../utils/common/dateUtils";
import { formatMoney } from "../../utils/common/numberUtils";
import { buildFileUrl } from "../../utils/common/fileUrl";
import ActionButton from "../../components/common/ActionButton";

type ApprovalType =
    | PersonnelRequisitionApproval
    | PersonnelHiringConfirmationApproval;

// Página independiente para visualizar e imprimir la requisición.
const PersonnelRequisitionFormat = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const requisitionId = Number(id);

    const {
        requisition,
        loading,
        error,
    } = usePersonnelRequisitionDetail(requisitionId);

    // Imprime el formato.
    const handlePrint = () => {
        window.print();
    };

    // Regresa al detalle de la requisición.
    const goBackToDetail = () => {
        navigate(
            `/dashboard/human-talent/requisitions/${requisitionId}`
        );
    };

    // Valida el motivo seleccionado.
    const isReasonSelected = (
        reason: RequisitionReason
    ): boolean => {
        return requisition?.reason === reason;
    };

    // Valida el tipo de contratación solicitado.
    const isContractSelected = (
        contractType: ContractType
    ): boolean => {
        return requisition?.contractType === contractType;
    };

    // Valida el tipo de contratación aprobado.
    const isApprovedContractSelected = (
        contractType: ContractType
    ): boolean => {
        return (
            requisition?.hiringConfirmation?.contractType ===
            contractType
        );
    };

    // Valida el tipo de practicante solicitado.
    const isInternContractSelected = (
        optionValue: string
    ): boolean => {
        return (
            String(requisition?.internContractType ?? "") ===
            optionValue
        );
    };

    // Valida el tipo de practicante aprobado.
    const isApprovedInternContractSelected = (
        optionValue: string
    ): boolean => {
        return (
            String(
                requisition?.hiringConfirmation
                    ?.internContractType ?? ""
            ) === optionValue
        );
    };

    // Casilla para mostrar una opción seleccionada.
    const OptionBox = ({
        label,
        checked,
    }: {
        label: string;
        checked: boolean;
    }) => (
        <Typography
            component="div"
            sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "18px",
                fontSize: "11px",
            }}
        >
            <Box
                component="span"
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: "18px",
                    height: "16px",
                    mr: 0.8,
                    border: "1px solid #000",
                    boxSizing: "border-box",
                    fontSize: "11px",
                    fontWeight: 700,
                }}
            >
                {checked ? "X" : ""}
            </Box>

            {label}
        </Typography>
    );

    // Línea de información.
    const FormatLine = ({
        label,
        value,
    }: {
        label: string;
        value?: string | number | null;
    }) => (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "190px minmax(0, 1fr)",
                alignItems: "end",
                columnGap: 0.5,
                mb: 0.6,
            }}
        >
            <Typography
                sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                }}
            >
                {label}:
            </Typography>

            <Box
                sx={{
                    minWidth: 0,
                    minHeight: "18px",
                    px: 0.8,
                    borderBottom: "1px solid #000",
                    fontSize: "11px",
                    overflowWrap: "anywhere",
                }}
            >
                {value ?? ""}
            </Box>
        </Box>
    );

    // Título de sección.
    const SectionTitle = ({
        title,
    }: {
        title: string;
    }) => (
        <Box
            sx={{
                mt: 1,
                py: 0.3,
                borderTop: "1px solid #000",
                borderBottom: "1px solid #000",
                backgroundColor: "#f2f2f2",
                textAlign: "center",
            }}
        >
            <Typography
                sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                }}
            >
                {title}
            </Typography>
        </Box>
    );

    // Espacio para una firma o aprobación.
    const SignatureBox = ({
        title,
        approval,
    }: {
        title: string;
        approval?: ApprovalType;
    }) => {
        /*
         * decidedBy normalmente contiene la persona que realizó
         * la aprobación y su firma.
         *
         * El cast permite revisar también approverUser.signatureUrl
         * sin producir error si esa propiedad no está declarada
         * directamente en la interfaz.
         */
        const approverUserWithSignature =
            approval?.approverUser as
            | {
                name?: string | null;
                signatureUrl?: string | null;
            }
            | undefined;

        const signatureUrl = buildFileUrl(approval?.decidedBy?.signatureUrl ||
            approverUserWithSignature?.signatureUrl ||
            "");

        const userName =
            approval?.decidedBy?.name ||
            approval?.approverUser?.name ||
            "";

        const positionName =
            approval?.approverPosition?.name ||
            title;

        return (
            <Box
                sx={{
                    minHeight: "105px",
                    px: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    textAlign: "center",
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{
                        height: "48px",
                        mb: 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {signatureUrl ? (
                        <Box
                            component="img"
                            src={signatureUrl}
                            alt={`Firma ${userName || positionName}`}
                            sx={{
                                display: "block",
                                width: "auto",
                                height: "auto",
                                maxWidth: "140px",
                                maxHeight: "42px",
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <Typography
                            sx={{
                                fontSize: "10px",
                                color: "#666",
                                fontStyle: "italic",
                            }}
                        >
                            Pendiente de firma
                        </Typography>
                    )}
                </Box>

                <Divider
                    sx={{
                        mb: 0.4,
                        borderColor: "#000",
                    }}
                />

                <Typography
                    sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                    }}
                >
                    {positionName}
                </Typography>

                <Typography sx={{ fontSize: "10px" }}>
                    {userName || "Pendiente por aprobar"}
                </Typography>

                <Typography sx={{ fontSize: "10px" }}>
                    Fecha:{" "}
                    {formatDate(
                        approval?.decidedAt
                    )}
                </Typography>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!requisition) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    No se encontró la requisición solicitada.
                </Alert>
            </Box>
        );
    }

    /*
     * Conserva tres espacios para las aprobaciones de requisición,
     * aunque todavía no existan registros.
     */
    const requisitionApprovalSlots: Array<
        PersonnelRequisitionApproval | undefined
    > = Array.from(
        { length: 3 },
        (_, index) => requisition.approvals?.[index]
    );

    /*
     * Conserva dos espacios para los VoBo de Talento Humano,
     * aunque todavía no exista confirmación o aprobación.
     */
    const hiringApprovalSlots: Array<
        PersonnelHiringConfirmationApproval | undefined
    > = Array.from(
        { length: 2 },
        (_, index) =>
            requisition.hiringConfirmation
                ?.approvals?.[index]
    );

    return (
        <>
            <GlobalStyles
                styles={{
                    "@page": {
                        size: "letter",
                        margin: "0",
                    },

                    "@media print": {
                        "html, body": {
                            margin: "0 !important",
                            padding: "0 !important",
                            backgroundColor: "#fff !important",
                        },

                        "body *": {
                            visibility: "hidden !important",
                        },

                        "#requisition-print-area, #requisition-print-area *":
                        {
                            visibility:
                                "visible !important",
                        },

                        "#requisition-print-area": {
                            position: "absolute",
                            left: "0",
                            top: "0",
                            width: "100%",
                            margin: "0",
                            padding: "0",
                        },

                        ".no-print": {
                            display: "none !important",
                        },
                    },
                }}
            />

            <Box
                sx={{
                    minHeight: "100vh",
                    py: 3,
                    px: {
                        xs: 1,
                        md: 3,
                    },
                    backgroundColor: "#f5f5f5",

                    "@media print": {
                        py: 0,
                        px: 0,
                        backgroundColor: "#fff",
                    },
                }}
            >
                <Stack
                    className="no-print"
                    direction="row"
                    spacing={1}
                    sx={{
                        mb: 2,
                        justifyContent: "center",
                    }}
                >
                    <ActionButton
                        actionType="back"
                        tooltip="Volver"
                        iconOnlyOnMobile
                        onClick={goBackToDetail}
                    >
                        Volver al detalle
                    </ActionButton>
                    {/* <ActionButton
                        actionType="print"
                        tooltip="Volver"
                        iconOnlyOnMobile
                        variant="contained"
                        onClick={handlePrint}
                    >
                        Imprimir formato
                    </ActionButton> */}

                    <Button
                        variant="contained"
                        onClick={handlePrint}
                    >
                        Imprimir formato
                    </Button>
                </Stack>

                <Box
                    id="requisition-print-area"
                    sx={{
                        width: "216mm",
                        minHeight: "279mm",
                        mx: "auto",
                        p: "12mm",
                        backgroundColor: "#fff",
                        boxShadow:
                            "0 4px 18px rgba(0,0,0,0.12)",
                        color: "#000",
                        fontFamily: "Arial, sans-serif",

                        "@media print": {
                            width: "216mm",
                            minHeight: "279mm",
                            margin: "0",
                            padding: "10mm",
                            boxShadow: "none",
                        },
                    }}
                >
                    <Box
                        sx={{
                            border: "1px solid #000",
                        }}
                    >
                        {/* Encabezado */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "90px minmax(0, 1fr)",
                                minHeight: "68px",
                                borderBottom:
                                    "1px solid #000",
                            }}
                        >
                            <Box
                                sx={{
                                    p: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRight:
                                        "1px solid #000",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={appBrand.logoIcon}
                                    alt={appBrand.logoAlt}
                                    sx={{
                                        width: "100%",
                                        maxWidth: "70px",
                                        maxHeight: "48px",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "14px",
                                        fontWeight: 700,
                                    }}
                                >
                                    LABORATORIOS INCOBRA S.A.
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                    }}
                                >
                                    REQUISICIÓN DE PERSONAL
                                </Typography>
                            </Box>
                        </Box>

                        {/* Información general */}
                        <SectionTitle title="Información general" />

                        <Box sx={{ p: 1 }}>
                            <FormatLine
                                label="Fecha solicitante"
                                value={formatDate(
                                    requisition.requestDate
                                )}
                            />

                            <FormatLine
                                label="Departamento o área solicitante"
                                value={
                                    requisition.department?.name
                                }
                            />

                            <FormatLine
                                label="Cargo requerido"
                                value={
                                    requisition.position?.name
                                }
                            />

                            <FormatLine
                                label="Código perfil de cargo"
                                value={
                                    requisition.position?.code
                                }
                            />

                            <FormatLine
                                label="Ciudad de labores"
                                value={requisition.city?.name}
                            />

                            <FormatLine
                                label="Solicitado por"
                                value={
                                    requisition.createdBy?.name
                                }
                            />
                        </Box>

                        {/* Motivo */}
                        <SectionTitle title="Motivo de requisición" />

                        <Box
                            sx={{
                                p: 1,
                                display: "grid",
                                gridTemplateColumns:
                                    "260px minmax(0, 1fr)",
                                gap: 0.8,
                            }}
                        >
                            <OptionBox
                                label="Cargo nuevo"
                                checked={isReasonSelected(
                                    "CARGO_NUEVO"
                                )}
                            />
                            <Box
                                sx={{
                                    borderBottom:
                                        "1px solid #000",
                                }}
                            />

                            <OptionBox
                                label="Reemplazo por retiro"
                                checked={isReasonSelected(
                                    "REEMPLAZO_RETIRO"
                                )}
                            />
                            <Box
                                sx={{
                                    borderBottom:
                                        "1px solid #000",
                                }}
                            />

                            <OptionBox
                                label="Incremento de la producción"
                                checked={isReasonSelected(
                                    "INCREMENTO_PRODUCCION"
                                )}
                            />
                            <Box
                                sx={{
                                    borderBottom:
                                        "1px solid #000",
                                }}
                            />

                            <OptionBox
                                label="Solicitud de practicantes"
                                checked={isReasonSelected(
                                    "SOLICITUD_PRACTICANTES"
                                )}
                            />
                            <Box
                                sx={{
                                    borderBottom:
                                        "1px solid #000",
                                }}
                            />

                            <OptionBox
                                label="Otros"
                                checked={isReasonSelected(
                                    "OTROS"
                                )}
                            />

                            <Box
                                sx={{
                                    minWidth: 0,
                                    px: 0.8,
                                    borderBottom:
                                        "1px solid #000",
                                    fontSize: "11px",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {requisition.otherReason || ""}
                            </Box>
                        </Box>

                        {/* Requerimientos */}
                        <SectionTitle title="Requerimientos de contratación" />

                        <Box sx={{ p: 1 }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <OptionBox
                                    label="Directo"
                                    checked={isContractSelected(
                                        "DIRECTO"
                                    )}
                                />

                                <OptionBox
                                    label="Temporal"
                                    checked={isContractSelected(
                                        "TEMPORAL"
                                    )}
                                />

                                <OptionBox
                                    label="Practicante"
                                    checked={isContractSelected(
                                        "PRACTICANTE"
                                    )}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <OptionBox
                                    label="Indefinido"
                                    checked={
                                        requisition.directContractType ===
                                        "INDEFINIDO"
                                    }
                                />

                                <OptionBox
                                    label="Fijo"
                                    checked={
                                        requisition.directContractType ===
                                        "FIJO"
                                    }
                                />

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                    }}
                                >
                                    Duración:{" "}
                                    {requisition.contractDurationMonths ||
                                        "____"}{" "}
                                    meses
                                </Typography>
                            </Box>

                            {/* Opciones de practicante */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                {internContractTypeOptions.map(
                                    (option) => (
                                        <OptionBox
                                            key={option.value}
                                            label={option.label}
                                            checked={isInternContractSelected(
                                                option.value
                                            )}
                                        />
                                    )
                                )}
                            </Box>

                            <FormatLine
                                label="Salario propuesto"
                                value={formatMoney(
                                    requisition.proposedSalary
                                )}
                            />
                        </Box>

                        {/* Aprobaciones */}
                        <SectionTitle title="Aprobaciones de requisición" />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, minmax(0, 1fr))",
                                gap: 2,
                                p: 1,
                            }}
                        >
                            {requisitionApprovalSlots.map(
                                (approval, index) => (
                                    <SignatureBox
                                        key={
                                            approval?.id ??
                                            `approval-${index}`
                                        }
                                        title={
                                            approval
                                                ?.approverPosition
                                                ?.name ||
                                            `Aprobación ${index + 1}`
                                        }
                                        approval={approval}
                                    />
                                )
                            )}
                        </Box>

                        {/* Confirmación */}
                        <SectionTitle title="Confirmación de contratación" />

                        <Box sx={{ p: 1 }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <OptionBox
                                    label="Directo"
                                    checked={isApprovedContractSelected(
                                        "DIRECTO"
                                    )}
                                />

                                <OptionBox
                                    label="Temporal"
                                    checked={isApprovedContractSelected(
                                        "TEMPORAL"
                                    )}
                                />

                                <OptionBox
                                    label="Practicante"
                                    checked={isApprovedContractSelected(
                                        "PRACTICANTE"
                                    )}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <OptionBox
                                    label="Indefinido"
                                    checked={
                                        requisition
                                            .hiringConfirmation
                                            ?.directContractType ===
                                        "INDEFINIDO"
                                    }
                                />

                                <OptionBox
                                    label="Fijo"
                                    checked={
                                        requisition
                                            .hiringConfirmation
                                            ?.directContractType ===
                                        "FIJO"
                                    }
                                />

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                    }}
                                >
                                    Duración:{" "}
                                    {requisition
                                        .hiringConfirmation
                                        ?.contractDurationMonths ||
                                        "____"}{" "}
                                    meses
                                </Typography>
                            </Box>

                            {/* Opciones de practicante aprobadas */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                {internContractTypeOptions.map(
                                    (option) => (
                                        <OptionBox
                                            key={option.value}
                                            label={option.label}
                                            checked={isApprovedInternContractSelected(
                                                option.value
                                            )}
                                        />
                                    )
                                )}
                            </Box>

                            <FormatLine
                                label="Salario aprobado"
                                value={formatMoney(
                                    requisition
                                        .hiringConfirmation
                                        ?.approvedSalary
                                )}
                            />

                            <FormatLine
                                label="Confirmado por"
                                value={
                                    requisition
                                        .hiringConfirmation
                                        ?.createdBy?.name
                                }
                            />
                        </Box>

                        {/* VoBo Talento Humano */}
                        <SectionTitle title="VoBo Talento Humano" />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: 2,
                                p: 1,
                            }}
                        >
                            {hiringApprovalSlots.map(
                                (approval, index) => (
                                    <SignatureBox
                                        key={
                                            approval?.id ??
                                            `vobo-${index}`
                                        }
                                        title={
                                            approval
                                                ?.approverPosition
                                                ?.name ||
                                            (index === 0
                                                ? "Auxiliar de Talento Humano"
                                                : "Jefe de Talento Humano")
                                        }
                                        approval={approval}
                                    />
                                )
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default PersonnelRequisitionFormat;