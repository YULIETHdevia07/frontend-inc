import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";

import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth/authService";
import { loginSchema } from "../../validations/auth/authValidation";
import type { LoginFormErrors } from "../../interfaces/auth/auth.interface";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

// Estado inicial de los errores del formulario.
const initialFormErrors: LoginFormErrors = {
    email: "",
    password: "",
};

// Hook encargado de manejar la lógica del inicio de sesión.
export const useLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Correo escrito por el usuario.
    const [email, setEmail] = useState("");

    // Contraseña escrita por el usuario.
    const [password, setPassword] = useState("");

    // Controla el estado de carga del botón.
    const [loading, setLoading] = useState(false);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<LoginFormErrors>(initialFormErrors);

    // Limpia mensajes generales y el error del campo que se está editando.
    const clearFieldError = (field: keyof LoginFormErrors) => {
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Actualiza el correo.
    const handleEmailChange = (value: string) => {
        setEmail(value);
        clearFieldError("email");
    };

    // Actualiza la contraseña.
    const handlePasswordChange = (value: string) => {
        setPassword(value);
        clearFieldError("password");
    };

    // Envía los datos al backend para iniciar sesión.
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            email,
            password,
        };

        try {
            await loginSchema.validate(formData, {
                abortEarly: false,
            });

            setFormErrors(initialFormErrors);
            setError("");
            setLoading(true);

            const response = await loginUser({
                email: email.trim(),
                password,
            });

            await login(response.token);

            navigate("/dashboard");
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: LoginFormErrors = {
                    ...initialFormErrors,
                };

                error.inner.forEach((validationError) => {
                    const path = validationError.path as keyof LoginFormErrors;

                    if (path) {
                        errors[path] = validationError.message;
                    }
                });

                setFormErrors(errors);
                setError("");
                return;
            }

            console.error(error);

            setError(getErrorMessage(error, "Correo o contraseña incorrectos."));
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        password,
        loading,

        error,
        formErrors,

        handleEmailChange,
        handlePasswordChange,
        handleLogin,
    };
};