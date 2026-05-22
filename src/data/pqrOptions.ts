// Opciones disponibles para seleccionar el tipo de caso al crear una PQR.
export const pqrCaseTypes = [
    {
        label: "SAP",
        value: "SAP",
    },
    {
        label: "Daño de equipo",
        value: "DANO_EQUIPO",
    },
    {
        label: "Instalación",
        value: "INSTALACION",
    },
    {
        label: "Otro",
        value: "OTRO",
    },
];

// Opciones disponibles para los estados de una PQR.
export const pqrStatusOptions = [
  { label: "PENDIENTE", value: "PENDIENTE" },
  { label: "EN PROCESO", value: "EN_PROCESO" },
  { label: "CERRADA", value: "CERRADA" },
];
