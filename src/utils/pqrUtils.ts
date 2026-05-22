import type { ChipProps } from "@mui/material";
import type { PqrStatus } from "../interfaces/pqr.interface";

// Devuelve el color del estado para el Chip.
export const getStatusColor = (
  status: PqrStatus
): ChipProps["color"] => {
  switch (status) {
    case "PENDIENTE":
      return "warning";

    case "EN_PROCESO":
      return "info";

    case "CERRADA":
      return "success";

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