import api from "../../api/axios";
import type { BulkUploadResponse } from "../../interfaces/users/bulkUpload.interface";
import type { User, UserRole } from "../../interfaces/users/user.interface";

// Obtiene todos los usuarios del sistema. Endpoint usado por ADMIN.
export const getAllUsers = async (): Promise<{
  message: string;
  users: User[];
}> => {
  const response = await api.get<{
    message: string;
    users: User[];
  }>("/users");

  return response.data;
};

// Obtiene únicamente los usuarios que tienen rol AGENT. Endpoint usado por ADMIN.
export const getAgents = async (): Promise<{
  message: string;
  agents: User[];
}> => {
  const response = await api.get<{
    message: string;
    agents: User[];
  }>("/users/agents");

  return response.data;
};

// Actualiza el rol de un usuario. Endpoint usado por ADMIN.
export const updateUserRole = async (
  userId: number,
  role: UserRole
) => {
  const response = await api.patch(`/users/${userId}/role`, {
    role,
  });

  return response.data;
};

// Registra usuarios mediante carga masiva desde archivo Excel. Endpoint usado por ADMIN.
export const uploadUsersBulk = async (
  file: File
): Promise<BulkUploadResponse<User>> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<BulkUploadResponse<User>>(
    "/auth/register/bulk",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};