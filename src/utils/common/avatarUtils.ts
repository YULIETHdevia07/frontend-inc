// Obtiene las iniciales de un nombre completo.
export const getInitials = (name?: string | null) => {
    if (!name) return "?";

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
};