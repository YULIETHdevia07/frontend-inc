import api from "../../api/axios";
import type {
    CreatePersonnelHiringConfirmationData,
    CreatePersonnelHiringConfirmationResponse,
    CreatePersonnelRequisitionData,
    CreatePersonnelRequisitionResponse,
    DecidePersonnelHiringConfirmationData,
    DecidePersonnelHiringConfirmationResponse,
    DecidePersonnelRequisitionData,
    DecidePersonnelRequisitionResponse,
    DepartmentsResponse,
    PersonnelRequisition,
    PersonnelRequisitionResponse,
    PositionProfilesResponse,
} from "../../interfaces/humanTalent/personnelRequisition.interface";

// Obtiene las áreas activas disponibles para crear una requisición de personal.
export const getDepartments = async (): Promise<DepartmentsResponse> => {
    const response = await api.get<DepartmentsResponse>(
        "/human-talent/departments"
    );

    return response.data;
};

// Obtiene los perfiles de cargo activos disponibles para crear una requisición.
export const getPositionProfiles =
    async (): Promise<PositionProfilesResponse> => {
        const response = await api.get<PositionProfilesResponse>(
            "/human-talent/position-profiles"
        );

        return response.data;
    };

// Crea una nueva requisición de personal.
export const createPersonnelRequisition = async (
    data: CreatePersonnelRequisitionData
): Promise<CreatePersonnelRequisitionResponse> => {
    const response = await api.post<CreatePersonnelRequisitionResponse>(
        "/human-talent/requisitions",
        data
    );

    return response.data;
};

// Obtiene las requisiciones donde el usuario autenticado participa.
export const getPersonnelRequisitions =
    async (): Promise<PersonnelRequisitionResponse> => {
        const response = await api.get<PersonnelRequisitionResponse>(
            "/human-talent/requisitions"
        );

        return response.data;
    };

export const getPersonnelRequisitionById = async (
    requisitionId: number
): Promise<{ requisition: PersonnelRequisition }> => {
    const response = await api.get<{ requisition: PersonnelRequisition }>(
        `/human-talent/requisitions/${requisitionId}`
    );

    return response.data;
};

// Aprueba, rechaza o cancela una requisición de personal.
export const decidePersonnelRequisition = async (
    requisitionId: number,
    data: DecidePersonnelRequisitionData
): Promise<DecidePersonnelRequisitionResponse> => {
    const response = await api.patch<DecidePersonnelRequisitionResponse>(
        `/human-talent/requisitions/${requisitionId}/decision`,
        data
    );

    return response.data;
};

// Registra la confirmación final de contratación de una requisición.
export const createPersonnelHiringConfirmation = async (
    requisitionId: number,
    data: CreatePersonnelHiringConfirmationData
): Promise<CreatePersonnelHiringConfirmationResponse> => {
    const response = await api.post<CreatePersonnelHiringConfirmationResponse>(
        `/human-talent/requisitions/${requisitionId}/hiring-confirmation`,
        data
    );

    return response.data;
};

// Aprueba, rechaza o cancela una confirmación de contratación.
export const decidePersonnelHiringConfirmation = async (
    hiringConfirmationId: number,
    data: DecidePersonnelHiringConfirmationData
): Promise<DecidePersonnelHiringConfirmationResponse> => {
    const response = await api.patch<DecidePersonnelHiringConfirmationResponse>(
        `/human-talent/hiring-confirmations/${hiringConfirmationId}/decision`,
        data
    );

    return response.data;
};