import axios from "axios";

// Extrae un mensaje de error amigable para mostrar al usuario.
export const getErrorMessage = (
  error: unknown,
  defaultMessage = "Ocurrió un error inesperado."
) => {
  if (!axios.isAxiosError(error)) {
    return defaultMessage;
  }

  if (!error.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
  }

  if (error.response.status >= 500) {
    return "Hay un problema con el servidor o la base de datos. Intenta nuevamente más tarde.";
  }

  const backendMessage = error.response.data?.message;

  if (typeof backendMessage === "string") {
    return backendMessage;
  }

  return defaultMessage;
};