import api from "../api/axios";
import type {
  CreatePqrData,
  PqrResponse,
  PqrStatus,
  SinglePqrResponse,
  TakePqrResponse,
} from "../interfaces/pqr.interface";

// Crea una nueva PQR. Endpoint usado por USER.
export const createPqr = async (
  data: CreatePqrData
): Promise<SinglePqrResponse> => {
  const response = await api.post<SinglePqrResponse>("/pqrs", data);
  return response.data;
};

// Obtiene las PQR creadas por el usuario autenticado.
export const getMyPqrs = async (): Promise<PqrResponse> => {
  const response = await api.get<PqrResponse>("/pqrs/my");
  return response.data;
};

// Obtiene todas las PQR. Endpoint usado por ADMIN.
export const getAllPqrs = async (): Promise<PqrResponse> => {
  const response = await api.get<PqrResponse>("/pqrs");
  return response.data;
};

// Actualiza el estado de una PQR. Endpoint usado por ADMIN.
export const updatePqrStatus = async (
  id: number,
  status: PqrStatus
): Promise<SinglePqrResponse> => {
  const response = await api.patch<SinglePqrResponse>(
    `/pqrs/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

// Responde una PQR. Endpoint usado por ADMIN o AGENT según tu backend.
export const respondPqr = async (
  id: number,
  responseText: string
): Promise<SinglePqrResponse> => {
  const response = await api.patch<SinglePqrResponse>(`/pqrs/${id}/respond`, {
    response: responseText,
  });

  return response.data;
};

// Obtiene las PQR disponibles para ser tomadas por un AGENT.
export const getAvailablePqrs = async (): Promise<PqrResponse> => {
  const response = await api.get<PqrResponse>("/pqrs/available");
  return response.data;
};

// Permite que un AGENT tome una PQR.
export const takePqr = async (
  pqrId: number
): Promise<TakePqrResponse> => {
  const response = await api.patch<TakePqrResponse>(`/pqrs/${pqrId}/take`);
  return response.data;
};

// Obtiene las PQR asignadas al AGENT autenticado.
export const getMyAssignedPqrs = async (): Promise<PqrResponse> => {
  const response = await api.get<PqrResponse>("/pqrs/assigned/my");
  return response.data;
};