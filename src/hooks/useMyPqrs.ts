import { useEffect, useState } from "react";
import type { Pqr } from "../interfaces/pqr.interface";
import { getMyPqrs } from "../services/pqrService";

// Hook encargado de manejar las PQR del usuario autenticado.
export const useMyPqrs = () => {
    // Lista de PQR creadas por el usuario.
    const [pqrs, setPqrs] = useState<Pqr[]>([]);

    // Controla la carga inicial de la vista.
    const [loading, setLoading] = useState(true);

    // Guarda errores generales al cargar las PQR.
    const [error, setError] = useState("");

    // Carga las PQR del usuario autenticado desde el backend.
    const loadMyPqrs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyPqrs();

            setPqrs(response.pqrs);
        } catch (error) {
            console.error(error);
            setError("Error al cargar las PQR.");
        } finally {
            setLoading(false);
        }
    };

    // Carga las PQR cuando se abre la vista.
    useEffect(() => {
        loadMyPqrs();
    }, []);

    return {
        pqrs,
        loading,
        error,
        loadMyPqrs,
    };
};