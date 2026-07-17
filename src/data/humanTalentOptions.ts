// Opciones disponibles para seleccionar el motivo de la requisición de personal.
export const requisitionReasonOptions = [
    {
        label: "Cargo nuevo",
        value: "CARGO_NUEVO",
    },
    {
        label: "Reemplazo por retiro",
        value: "REEMPLAZO_RETIRO",
    },
    {
        label: "Incremento de producción",
        value: "INCREMENTO_PRODUCCION",
    },
    {
        label: "Solicitud de practicantes",
        value: "SOLICITUD_PRACTICANTES",
    },
    {
        label: "Otros",
        value: "OTROS",
    },
];

// Opciones disponibles para seleccionar el tipo principal de contratación.
export const contractTypeOptions = [
    {
        label: "Directo",
        value: "DIRECTO",
    },
    {
        label: "Temporal",
        value: "TEMPORAL",
    },
    {
        label: "Practicante",
        value: "PRACTICANTE",
    },
];

// Opciones disponibles para seleccionar el tipo de contrato directo.
export const directContractTypeOptions = [
    {
        label: "Indefinido",
        value: "INDEFINIDO",
    },
    {
        label: "Fijo",
        value: "FIJO",
    },
];

// Opciones disponibles para seleccionar el tipo de practicante.
export const internContractTypeOptions = [
    {
        label: "Aprendiz",
        value: "APRENDIZ",
    },
    {
        label: "Pasante",
        value: "PASANTE",
    },
    {
        label: "Rotante",
        value: "ROTANTE",
    },
];

// Opciones disponibles para los estados de una requisición de personal.
export const requisitionStatusOptions = [
    {
        label: "En aprobación",
        value: "PENDIENTE_APROBACION",
    },
    {
        label: "En aprobación",
        value: "EN_APROBACION",
    },
    {
        label: "Pendiente confirmación TH",
        value: "PENDIENTE_CONFIRMACION_TALENTO_HUMANO",
    },
    {
        label: "Pendiente aprobación TH",
        value: "PENDIENTE_APROBACION_TALENTO_HUMANO",
    },
    {
        label: "Aprobada",
        value: "APROBADA",
    },
    {
        label: "Rechazada",
        value: "RECHAZADA",
    },
    {
        label: "Cancelada",
        value: "CANCELADA",
    },
];