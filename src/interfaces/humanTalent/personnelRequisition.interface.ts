import type { City } from "../common/city.interface";
/*  */
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

// Estados permitidos para una requisición de personal.
export type RequisitionStatus =
    | "PENDIENTE"
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

// Usuario que crea una requisición de personal.
export interface RequisitionUser {
    id: number;
    name: string;
    email: string;
    role: string;
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

    // Datos de requerimientos de contratación.
    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;

    proposedSalary: string;
    status: RequisitionStatus;

    createdById: number;
    createdBy?: RequisitionUser;

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

// Respuesta al crear una requisición de personal.
export interface CreatePersonnelRequisitionResponse {
    message: string;
    requisition: PersonnelRequisition;
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