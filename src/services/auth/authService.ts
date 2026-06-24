import api from "../../api/axios";
import type {
    LoginData,
    LoginResponse,
    RegisterData,
    RegisterResponse,
} from "../../interfaces/auth/auth.interface";

// Inicia sesión con correo y contraseña.
export const loginUser = async (
    data: LoginData
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/users/login", data);

    return response.data;
};

// Registra un nuevo usuario en el sistema.
export const registerUser = async (
    data: RegisterData
): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);

    return response.data;
};