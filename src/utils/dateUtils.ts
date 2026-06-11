// Formatea la fecha en español.
export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};