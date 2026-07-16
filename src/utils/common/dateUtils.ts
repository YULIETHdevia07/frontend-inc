// Formatea la fecha en español.
export const formatDate = (value?: string | null) => {
        if (!value) return "____/____/____";

        return new Date(value).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };