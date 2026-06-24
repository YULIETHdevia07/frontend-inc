// Estados permitidos para una PQR.
export type PqrStatus = "PENDIENTE" | "EN_PROCESO" | "CERRADA";

// Prioridades permitidas para una PQR.
export type PqrPriority = "BAJA" | "MEDIA" | "ALTA" | "URGENTE";

// Roles permitidos en el sistema.
export type UserRole = "USER" | "ADMIN" | "AGENT";

// Vistas disponibles en la página del agente.
export type AgentPqrView = "AVAILABLE" | "ASSIGNED";

// Tipos de mensajes usados en alertas o snackbar.
export type MessageType = "success" | "error" | "info" | "warning";

// Tipos de archivos adjuntos permitidos en el chat de PQR.
export type PqrAttachmentType = "IMAGE" | "DOCUMENT";

// Usuario relacionado con una PQR.
export interface PqrUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Archivo adjunto relacionado con un mensaje de PQR.
export interface PqrMessageAttachment {
  id: number;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: PqrAttachmentType;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  messageId: number;
}

// Estructura principal de una PQR.
export interface Pqr {
  id: number;
  caseType: string;
  description: string;
  status: PqrStatus;
  createdAt: string;
  updatedAt: string;
  userId: number;
  assignedToId: number | null;
  user?: PqrUser;
  assignedTo?: PqrUser | null;
  unreadMessagesCount?: number;

  // Datos de calificación de la PQR.
  rating?: number | null;
  ratingComment?: string | null;
  ratedAt?: string | null;

  priority: PqrPriority | null;
}

// Mensaje perteneciente al chat de una PQR.
export interface PqrMessage {
  id: number;
  content: string | null;
  createdAt: string;
  pqrId: number;
  senderId: number;
  sender: PqrUser;
  attachments: PqrMessageAttachment[];
}

// Datos recibidos cuando se actualiza el contador de mensajes no revisados.
export interface PqrUnreadCountUpdatedData {
  pqrId: number;
  unreadMessagesCount: number;
}

// Datos necesarios para crear una nueva PQR.
export interface CreatePqrData {
  caseType: string;
  description: string;
  file?: File;
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

// Respuesta al obtener el historial de mensajes de una PQR.
export interface PqrMessagesResponse {
  message: string;
  messages: PqrMessage[];
}

// Respuesta al enviar un mensaje con archivo adjunto.
export interface PqrMessageWithAttachmentResponse {
  message: string;
  pqrMessage: PqrMessage;
}

// Errores de validación YUP del formulario para crear una PQR.
export interface CreatePqrFormErrors {
  caseType: string;
  description: string;
  file: string;
}

// Parámetros necesarios para inicializar el hook del chat de una PQR.
export interface UsePqrChatParams {
  pqrId: number | null;
  token: string | null;
}