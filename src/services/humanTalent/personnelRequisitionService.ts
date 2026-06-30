import api from "../../api/axios";
import type {
    CreatePersonnelRequisitionData,
    CreatePersonnelRequisitionResponse,
    DepartmentsResponse,
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

// Obtiene las requisiciones de personal registradas en el sistema.
export const getPersonnelRequisitions =
    async (): Promise<PersonnelRequisitionResponse> => {
        const response = await api.get<PersonnelRequisitionResponse>(
            "/human-talent/requisitions"
        );

        return response.data;
    };