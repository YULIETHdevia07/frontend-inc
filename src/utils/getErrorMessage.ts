import axios from "axios";

// Extrae el mensaje de error enviado por el backend.
export const getErrorMessage = (
    error: unknown,
    defaultMessage = "Ocurrió un error inesperado."
) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || defaultMessage;
    }

    return defaultMessage;
};