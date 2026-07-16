// Elimina caracteres que no sean números.
export const cleanNumberInput = (value: string) => {
    return value.replace(/\D/g, "");
};

// Formatea un número para mostrarlo con separadores de miles en un input.
export const formatNumberInput = (value: string | number | "") => {
    if (value === "") return "";

    const cleanValue = String(value).replace(/\D/g, "");

    if (!cleanValue) return "";

    return new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 0,
    }).format(Number(cleanValue));
};

// Formatea valores monetarios.
export const formatMoney = (
    value?: string | number | null
): string => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return String(value);
    }

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(numericValue);
};