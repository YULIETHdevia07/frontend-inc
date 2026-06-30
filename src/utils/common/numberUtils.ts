// Elimina caracteres que no sean números.
export const cleanNumberInput = (value: string) => {
    return value.replace(/\D/g, "");
};

// Formatea un número para mostrarlo con separadores de miles.
export const formatNumberInput = (value: string | number | "") => {
    if (value === "") return "";

    const cleanValue = String(value).replace(/\D/g, "");

    if (!cleanValue) return "";

    return new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 0,
    }).format(Number(cleanValue));
};