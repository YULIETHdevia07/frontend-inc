// Datos necesarios para iniciar sesión.
export interface LoginData {
    email: string;
    password: string;
}

// Respuesta del login.
export interface LoginResponse {
    message: string;
    token: string;
}

// Datos necesarios para registrar un usuario.
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

// Respuesta del registro.
export interface RegisterResponse {
    message: string;
}

// Errores de validación YUP del formulario de login.
export interface LoginFormErrors {
    email: string;
    password: string;
}

// Errores de validación YUP del formulario de registro.
export interface RegisterFormErrors {
    name: string;
    email: string;
    password: string;
}