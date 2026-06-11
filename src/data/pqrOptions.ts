// Opciones disponibles para seleccionar el tipo de caso al crear una PQR.
export const pqrCaseTypes = [
    {
        label: "SAP",
        value: "SAP",
    },
    {
        label: "BEAS",
        value: "BEAS",
    },
    {
        label: "Terminal",
        value: "TERMINAL",
    },
    {
        label: "Correo",
        value: "CORREO",
    },
    {
        label: "Intranet",
        value: "INTRANET",
    },
    {
        label: "Soporte Equipos",
        value: "SOPORTE_EQUIPOS",
    },
    {
        label: "Soporte Red",
        value: "SOPORTE_RED",
    },
    {
        label: "Mi Portal SAP",
        value: "MI_PORTAL_SAP",
    },
    {
        label: "LegalisApp",
        value: "LEGALISAPP",
    },
    {
        label: "Nuevas Solicitudes",
        value: "NUEVAS_SOLICITUDES",
    },
];

// Opciones disponibles para los estados de una PQR.
export const pqrStatusOptions = [
    { label: "PENDIENTE", value: "PENDIENTE" },
    { label: "EN PROCESO", value: "EN_PROCESO" },
    { label: "CERRADA", value: "CERRADA" },
];

// Opciones disponibles para la prioridad de una PQR.
export const pqrPriorityOptions = [
    { value: "BAJA", label: "Baja" },
    { value: "MEDIA", label: "Media" },
    { value: "ALTA", label: "Alta" },
    { value: "URGENTE", label: "Urgente" },
];