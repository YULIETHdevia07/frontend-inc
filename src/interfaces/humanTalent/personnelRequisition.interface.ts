import type { City } from "../common/city.interface";

// Motivos permitidos para una requisición de personal.
export type RequisitionReason =
    | "CARGO_NUEVO"
    | "REEMPLAZO_RETIRO"
    | "INCREMENTO_PRODUCCION"
    | "SOLICITUD_PRACTICANTES"
    | "OTROS";

// Tipos principales de contratación permitidos.
export type ContractType = "DIRECTO" | "TEMPORAL" | "PRACTICANTE";

// Tipos de contrato directo permitidos.
export type DirectContractType = "INDEFINIDO" | "FIJO";

// Tipos de practicante permitidos.
export type InternContractType = "APRENDIZ" | "PASANTE" | "ROTANTE";

// Decisiones permitidas en el flujo de aprobación.
export type ApprovalDecision = "APROBADA" | "RECHAZADA" | "CANCELADA";

// Estados calculados para una requisición de personal.
export type RequisitionStatus =
    | "PENDIENTE_JEFE_AREA"
    | "PENDIENTE_JEFE_DEPARTAMENTO"
    | "PENDIENTE_GERENCIA_GENERAL"
    | "PENDIENTE_CONFIRMACION_TALENTO_HUMANO"
    | "PENDIENTE_ANALISTA_TALENTO_HUMANO"
    | "PENDIENTE_JEFE_TALENTO_HUMANO"
    | "APROBADA"
    | "RECHAZADA"
    | "CANCELADA";

// Área solicitante relacionada con una requisición de personal.
export interface Department {
    id: number;
    code: string;
    name: string;
}

// Perfil de cargo relacionado con una requisición de personal.
export interface PositionProfile {
    id: number;
    code: string;
    name: string;
}

// Usuario relacionado con una requisición o aprobación.
export interface RequisitionUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Paso de aprobación de una requisición.
export interface RequisitionApprovalStep {
    id: number;
    name: string;
    stepOrder: number;
    requiredRole: string;
    isActive: boolean;
}

// Aprobación realizada sobre una requisición.
export interface PersonnelRequisitionApproval {
    id: number;
    requisitionId: number;
    stepId: number;
    decision: ApprovalDecision;
    decidedById: number;
    decidedAt: string;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
    step?: RequisitionApprovalStep;
    decidedBy?: RequisitionUser;
}

// Confirmación final de contratación registrada por Talento Humano.
export interface PersonnelHiringConfirmation {
    id: number;
    requisitionId: number;

    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;

    approvedSalary: string;

    createdById: number;
    createdBy?: RequisitionUser;

    approvals?: PersonnelHiringConfirmationApproval[];

    createdAt: string;
    updatedAt: string;
}

// Aprobación realizada sobre la confirmación de contratación.
export interface PersonnelHiringConfirmationApproval {
    id: number;
    hiringConfirmationId: number;
    stepId: number;
    decision: ApprovalDecision;
    decidedById: number;
    decidedAt: string;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
    step?: RequisitionApprovalStep;
    decidedBy?: RequisitionUser;
}

// Estructura principal de una requisición de personal.
export interface PersonnelRequisition {
    id: number;
    requestDate: string;

    departmentId: number;
    department: Department;

    positionId: number;
    position: PositionProfile;

    reason: RequisitionReason;
    otherReason: string | null;

    cityId: number;
    city: City;

    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;

    proposedSalary: string;
    status: RequisitionStatus;

    createdById: number;
    createdBy?: RequisitionUser;

    approvals?: PersonnelRequisitionApproval[];
    hiringConfirmation?: PersonnelHiringConfirmation | null;

    createdAt: string;
    updatedAt: string;
}

// Datos del formulario para crear una requisición de personal.
export interface PersonnelRequisitionForm {
    departmentId: string;
    positionId: string;
    reason: RequisitionReason | "";
    otherReason: string;
    cityId: string;

    contractType: ContractType | "";
    directContractType: DirectContractType | "";
    contractDurationMonths: string;
    internContractType: InternContractType | "";

    proposedSalary: string;
}

// Datos enviados al backend para crear una requisición de personal.
export interface CreatePersonnelRequisitionData {
    departmentId: number;
    positionId: number;
    reason: RequisitionReason;
    otherReason: string | null;
    cityId: number;

    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;

    proposedSalary: number;
}

// Datos enviados al backend para aprobar, rechazar o cancelar una requisición.
export interface DecidePersonnelRequisitionData {
    decision: ApprovalDecision;
    comment?: string | null;
}

// Datos enviados al backend para registrar la confirmación final de contratación.
export interface CreatePersonnelHiringConfirmationData {
    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;
    approvedSalary: number;
}

// Datos enviados al backend para aprobar, rechazar o cancelar una confirmación de contratación.
export interface DecidePersonnelHiringConfirmationData {
    decision: ApprovalDecision;
    comment?: string | null;
}

// Respuesta al crear una requisición de personal.
export interface CreatePersonnelRequisitionResponse {
    message: string;
    requisition: PersonnelRequisition;
}

// Respuesta al aprobar, rechazar o cancelar una requisición.
export interface DecidePersonnelRequisitionResponse {
    message: string;
    approval: PersonnelRequisitionApproval;
}

// Respuesta al obtener múltiples requisiciones de personal.
export interface PersonnelRequisitionResponse {
    message: string;
    requisitions: PersonnelRequisition[];
}

// Respuesta al obtener las áreas activas.
export interface DepartmentsResponse {
    message: string;
    departments: Department[];
}

// Respuesta al obtener los perfiles de cargo activos.
export interface PositionProfilesResponse {
    message: string;
    positionProfiles: PositionProfile[];
}

// Respuesta al registrar una confirmación final de contratación.
export interface CreatePersonnelHiringConfirmationResponse {
    message: string;
    hiringConfirmation: PersonnelHiringConfirmation;
}

// Respuesta al aprobar, rechazar o cancelar una confirmación de contratación.
export interface DecidePersonnelHiringConfirmationResponse {
    message: string;
    approval: PersonnelHiringConfirmationApproval;
}

// Errores de validación del formulario para crear una requisición.
export interface CreatePersonnelRequisitionFormErrors {
    departmentId: string;
    positionId: string;
    reason: string;
    otherReason: string;
    cityId: string;
    contractType: string;
    directContractType: string;
    contractDurationMonths: string;
    internContractType: string;
    proposedSalary: string;
}