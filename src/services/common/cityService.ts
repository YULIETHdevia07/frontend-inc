import api from "../../api/axios";
import type { CitiesResponse } from "../../interfaces/common/city.interface";

// Obtiene las ciudades activas disponibles en el sistema.
export const getCities = async (): Promise<CitiesResponse> => {
    const response = await api.get<CitiesResponse>("/common/cities");

    return response.data;
};