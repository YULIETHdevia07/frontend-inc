import type { ChipProps } from "@mui/material";
import type { PqrStatus } from "../../interfaces/pqrs/pqr.interface";

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

// Convierte el tipo de caso en un texto legible.
export const getCaseTypeLabel = (caseType: string) => {
  switch (caseType) {
    case "SAP":
      return "SAP";

    case "BEAS":
      return "BEAS";

    case "TERMINAL":
      return "Terminal";

    case "CORREO":
      return "Correo";

    case "INTRANET":
      return "Intranet";

    case "SOPORTE_EQUIPOS":
      return "Soporte Equipos";

    case "SOPORTE_RED":
      return "Soporte Red";

    case "MI_PORTAL_SAP":
      return "Mi Portal SAP";

    case "LEGALISAPP":
      return "LegalisApp";

    case "NUEVAS_SOLICITUDES":
      return "Nuevas Solicitudes";

    default:
      return caseType;
  }
};