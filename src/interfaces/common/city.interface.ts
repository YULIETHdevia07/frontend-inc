// Ciudad disponible en el sistema.
export interface City {
    id: number;
    name: string;
}

// Respuesta al obtener las ciudades activas.
export interface CitiesResponse {
    message: string;
    cities: City[];
}