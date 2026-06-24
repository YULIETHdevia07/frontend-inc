export type UserRole = "USER" | "ADMIN" | "AGENT";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}