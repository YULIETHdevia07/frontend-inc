import type { ChipProps } from "@mui/material";
import type { RequisitionStatus } from "../../interfaces/humanTalent/personnelRequisition.interface";

// Devuelve el texto legible del estado de la requisición.
export const getStatusLabel = (status: RequisitionStatus) => {
  switch (status) {
    case "EN_APROBACION":
      return "En aprobación";

    case "PENDIENTE_CONFIRMACION_TALENTO_HUMANO":
      return "Pendiente confirmación TH";

    case "PENDIENTE_APROBACION_TALENTO_HUMANO":
      return "Pendiente aprobación TH";

    case "APROBADA":
      return "Aprobada";

    case "RECHAZADA":
      return "Rechazada";

    case "CANCELADA":
      return "Cancelada";

    default:
      return status;
  }
};

// Devuelve el color del estado para el Chip.
export const getStatusColor = (
  status: RequisitionStatus
): ChipProps["color"] => {
  switch (status) {
    case "EN_APROBACION":
    case "PENDIENTE_CONFIRMACION_TALENTO_HUMANO":
    case "PENDIENTE_APROBACION_TALENTO_HUMANO":
      return "warning";

    case "APROBADA":
      return "success";

    case "RECHAZADA":
    case "CANCELADA":
      return "error";

    default:
      return "default";
  }
};