// Convierte una ruta de archivo o imagen del backend en una URL completa.
export const buildFileUrl = (fileUrl?: string | null) => {
    if (!fileUrl) return "";

    if (fileUrl.startsWith("http")) {
        return fileUrl;
    }

    const BACKEND_URL =
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:3000";

    return `${BACKEND_URL}${fileUrl}`;
};