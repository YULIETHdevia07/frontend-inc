import api from "../api/axios";
import type { BulkUploadResponse } from "../interfaces/bulkUpload.interface";
import type { User, UserRole } from "../interfaces/user.interface";

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserRole = async (
  userId: number,
  role: UserRole
) => {
  const response = await api.patch(`/users/${userId}/role`, {
    role,
  });

  return response.data;
};

// Registra usuarios mediante carga masiva desde archivo Excel.
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