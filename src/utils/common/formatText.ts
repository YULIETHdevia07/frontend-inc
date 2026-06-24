// Convierte un texto en formato título: ADMIN -> Admin.
export const capitalizeText = (text: string) => {
    if (!text) return "";

    const lowerText = text.toLowerCase();

    return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
};