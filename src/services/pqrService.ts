import api from "../api/axios";

export interface CreatePqrData {
  title: string;
  description: string;
}

export type PqrStatus = "PENDIENTE" | "EN_PROCESO" | "RESPONDIDA" | "CERRADA";

export interface Pqr {
  id: number;
  title: string;
  description: string;
  status: PqrStatus;
  response: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

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