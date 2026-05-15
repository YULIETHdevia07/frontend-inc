import type { ChipProps } from "@mui/material";
import type { PqrStatus } from "../services/pqrService";

// Opciones disponibles para los estados de una PQR.
export const pqrStatusOptions = [
  { label: "PENDIENTE", value: "PENDIENTE" },
  { label: "EN PROCESO", value: "EN_PROCESO" },
  { label: "RESPONDIDA", value: "RESPONDIDA" },
  { label: "CERRADA", value: "CERRADA" },
];

// Devuelve el color del estado para el Chip.
export const getStatusColor = (
  status: PqrStatus
): ChipProps["color"] => {
  switch (status) {
    case "PENDIENTE":
      return "warning";

    case "EN_PROCESO":
      return "info";

    case "RESPONDIDA":
      return "success";

    case "CERRADA":
      return "default";

    default:
      return "default";
  }
};

// Formatea la fecha en español.
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Convierte el tipo de caso en un texto legible.
export const getCaseTypeLabel = (caseType: string) => {
  switch (caseType) {
    case "SAP":
      return "SAP";

    case "DANO_EQUIPO":
      return "Daño de equipo";

    case "INSTALACION":
      return "Instalación";

    case "OTRO":
      return "Otro";

    default:
      return caseType;
  }
};