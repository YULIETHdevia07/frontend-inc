// Estados permitidos para una PQR.
export type PqrStatus = "PENDIENTE" | "EN_PROCESO" | "CERRADA";

// Priodad permitidos para una PQR.
export type PqrPriority = "BAJA" | "MEDIA" | "ALTA" | "URGENTE";

// Vistas disponibles en la página del agente.
export type AgentPqrView = "AVAILABLE" | "ASSIGNED";

// Tipos de mensajes usados en alertas o snackbar.
export type MessageType = "success" | "error" | "info" | "warning";

// Usuario relacionado con una PQR.
export interface PqrUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Estructura principal de una PQR.
export interface Pqr {
  id: number;
  caseType: string;
  description: string;
  status: PqrStatus;
  response: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  assignedToId: number | null;
  user?: PqrUser;
  assignedTo?: PqrUser | null;

  // Datos de calificación de la PQR.
  rating?: number | null;
  ratingComment?: string | null;
  ratedAt?: string | null;

  priority: PqrPriority;
}

// Datos necesarios para crear una nueva PQR.
export interface CreatePqrData {
  caseType: string;
  description: string;
}

// Datos necesarios para calificar una PQR.
export interface RatePqrData {
  rating: number;
  ratingComment?: string;
}

// Respuesta al obtener múltiples PQR.
export interface PqrResponse {
  message: string;
  pqrs: Pqr[];
}

// Respuesta para endpoints que devuelven una sola PQR.
export interface SinglePqrResponse {
  message: string;
  pqr: Pqr;
}

// Respuesta al tomar o asignar una PQR.
export interface TakePqrResponse {
  message: string;
  pqr: Pqr;
}

// Respuesta al calificar una PQR.
export interface RatePqrResponse {
  message: string;
  pqr: Pqr;
}

// Errores de validación del formulario para crear una PQR.
export interface CreatePqrFormErrors {
  caseType: string;
  description: string;
}