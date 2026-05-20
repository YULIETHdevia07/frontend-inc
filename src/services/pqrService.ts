import api from "../api/axios";
import type {
  CreatePqrData,
  PqrResponse,
  PqrStatus,
  TakePqrResponse
} from "../interfaces/pqr.interface";

export const createPqr = async (data: CreatePqrData) => {
  const response = await api.post("/pqrs", data);
  return response.data;
};

export const getMyPqrs = async () => {
  const response = await api.get("/pqrs/my");
  return response.data;
};

export const getAllPqrs = async () => {
  const response = await api.get("/pqrs");
  return response.data;
};

export const updatePqrStatus = async (id: number, status: PqrStatus) => {
  const response = await api.patch(`/pqrs/${id}/status`, {
    status,
  });

  return response.data;
};

export const respondPqr = async (id: number, responseText: string) => {
  const response = await api.patch(`/pqrs/${id}/respond`, {
    response: responseText,
  });

  return response.data;
};

// Obtiene las PQR disponibles para ser tomadas por un AGENT
export const getAvailablePqrs = async () => {
  const response = await api.get<PqrResponse>("/pqrs/available");
  return response.data;
};

// Permite que un AGENT tome una PQR
export const takePqr = async (pqrId: number) => {
  const response = await api.patch<TakePqrResponse>(`/pqrs/${pqrId}/take`);
  return response.data;
};

// Obtiene las PQR asignadas al AGENT autenticado
export const getMyAssignedPqrs = async () => {
  const response = await api.get<PqrResponse>("/pqrs/assigned/my");
  return response.data;
};