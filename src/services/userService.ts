import api from "../api/axios";
import type { UserRole } from "../interfaces/user.interface";

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