import api from "../../api/axios";
import type {
  CreatePqrData,
  PqrMessagesResponse,
  PqrMessageWithAttachmentResponse,
  PqrPriority,
  PqrResponse,
  PqrStatus,
  RatePqrData,
  RatePqrResponse,
  SinglePqrResponse,
  TakePqrResponse,
} from "../../interfaces/pqrs/pqr.interface";

// Crea una nueva PQR. Endpoint usado por USER.
export const createPqr = async (
  data: CreatePqrData
): Promise<SinglePqrResponse> => {
  // Si no hay archivo, se envía como JSON normal.
  if (!data.file) {
    const response = await api.post<SinglePqrResponse>("/pqrs", {
      caseType: data.caseType,
      description: data.description,
    });

    return response.data;
  }

  const formData = new FormData();

  formData.append("caseType", data.caseType);
  formData.append("description", data.description);
  formData.append("file", data.file);

  const response = await api.post<SinglePqrResponse>("/pqrs", formData);

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

// Actualiza el estado de una PQR. Endpoint usado por ADMIN o AGENT.
export const updatePqrStatus = async (
  id: number,
  status: PqrStatus
): Promise<SinglePqrResponse> => {
  const response = await api.patch<SinglePqrResponse>(`/pqrs/${id}/status`, {
    status,
  });

  return response.data;
};

// Actualiza la prioridad de una PQR. Endpoint usado por ADMIN o AGENT.
export const updatePqrPriority = async (
  id: number,
  priority: PqrPriority
): Promise<SinglePqrResponse> => {
  const response = await api.patch<SinglePqrResponse>(`/pqrs/${id}/priority`, {
    priority,
  });

  return response.data;
};

// Obtiene el historial de mensajes de una PQR.
export const getPqrMessages = async (
  pqrId: number
): Promise<PqrMessagesResponse> => {
  const response = await api.get<PqrMessagesResponse>(
    `/pqrs/${pqrId}/messages`
  );

  return response.data;
};

// Marca como leído el chat de una PQR para el usuario autenticado.
export const markPqrChatAsRead = async (
  pqrId: number
): Promise<{ message: string }> => {
  const response = await api.patch<{ message: string }>(
    `/pqrs/${pqrId}/messages/read`
  );

  return response.data;
};

// Envía un mensaje con archivo adjunto en una PQR.
export const sendPqrMessageWithAttachment = async (
  pqrId: number,
  file: File,
  content?: string
): Promise<PqrMessageWithAttachmentResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  if (content?.trim()) {
    formData.append("content", content.trim());
  }

  const response = await api.post<PqrMessageWithAttachmentResponse>(
    `/pqrs/${pqrId}/messages/attachment`,
    formData
  );

  return response.data;
};

// Obtiene las PQR disponibles para ser tomadas por un AGENT.
export const getAvailablePqrs = async (): Promise<PqrResponse> => {
  const response = await api.get<PqrResponse>("/pqrs/available");
  return response.data;
};

// Permite que un AGENT tome una PQR.
export const takePqr = async (pqrId: number): Promise<TakePqrResponse> => {
  const response = await api.patch<TakePqrResponse>(`/pqrs/${pqrId}/take`);
  return response.data;
};

// Permite que un ADMIN asigne o reasigne una PQR a un AGENT.
export const assignPqr = async (
  pqrId: number,
  agentId: number
): Promise<SinglePqrResponse> => {
  const response = await api.patch<SinglePqrResponse>(
    `/pqrs/${pqrId}/assign`,
    {
      agentId,
    }
  );

  return response.data;
};

// Permite que un ADMIN desasigne una PQR.
export const unassignPqr = async (
  pqrId: number
): Promise<SinglePqrResponse> => {
  const response = await api.patch<SinglePqrResponse>(
    `/pqrs/${pqrId}/unassign`
  );

  return response.data;
};

// Obtiene las PQR asignadas al AGENT autenticado.
export const getMyAssignedPqrs = async (): Promise<PqrResponse> => {
  const response = await api.get<PqrResponse>("/pqrs/assigned/my");
  return response.data;
};

// Califica una PQR cerrada. Endpoint usado por USER.
export const ratePqr = async (
  pqrId: number,
  data: RatePqrData
): Promise<RatePqrResponse> => {
  const response = await api.patch<RatePqrResponse>(
    `/pqrs/${pqrId}/rate`,
    data
  );

  return response.data;
};