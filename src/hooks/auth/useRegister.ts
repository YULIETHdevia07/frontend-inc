import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";
import { registerUser } from "../../services/auth/authService";
import { registerSchema } from "../../validations/auth/authValidation";
import type { RegisterFormErrors } from "../../interfaces/auth/auth.interface";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

// Estado inicial de los errores del formulario.
const initialFormErrors: RegisterFormErrors = {
    name: "",
    email: "",
    password: "",
};

// Hook encargado de manejar la lógica del registro de usuarios.
export const useRegister = () => {
    const navigate = useNavigate();

    // Nombre completo escrito por el usuario.
    const [name, setName] = useState("");

    // Correo electrónico escrito por el usuario.
    const [email, setEmail] = useState("");

    // Contraseña escrita por el usuario.
    const [password, setPassword] = useState("");

    // Controla el estado de carga del botón.
    const [loading, setLoading] = useState(false);

    // Mensaje de éxito al registrar usuario.
    const [message, setMessage] = useState("");

    // Controla si se muestra el mensaje visual de éxito.
    const [openMessage, setOpenMessage] = useState(false);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<RegisterFormErrors>(initialFormErrors);

    // Limpia mensajes generales y el error del campo que se está editando.
    const clearFieldError = (field: keyof RegisterFormErrors) => {
        setMessage("");
        setOpenMessage(false);
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Actualiza el nombre.
    const handleNameChange = (value: string) => {
        setName(value);
        clearFieldError("name");
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

    // Cierra el mensaje visual de éxito.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Envía los datos al backend para registrar un nuevo usuario.
    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            name,
            email,
            password,
        };

        try {
            await registerSchema.validate(formData, {
                abortEarly: false,
            });

            setFormErrors(initialFormErrors);
            setError("");
            setMessage("");
            setOpenMessage(false);
            setLoading(true);

            const response = await registerUser({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            setName("");
            setEmail("");
            setPassword("");

            setMessage(response.message || "Usuario registrado correctamente.");
            setOpenMessage(true);

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: RegisterFormErrors = {
                    ...initialFormErrors,
                };

                error.inner.forEach((validationError) => {
                    const path = validationError.path as keyof RegisterFormErrors;

                    if (path) {
                        errors[path] = validationError.message;
                    }
                });

                setFormErrors(errors);
                setMessage("");
                setOpenMessage(false);
                setError("");
                return;
            }

            console.error(error);

            setError(getErrorMessage(error, "Error al registrar usuario."));
            setMessage("");
            setOpenMessage(false);
        } finally {
            setLoading(false);
        }
    };

    return {
        name,
        email,
        password,
        loading,

        message,
        openMessage,
        error,
        formErrors,

        handleNameChange,
        handleEmailChange,
        handlePasswordChange,
        handleRegister,
        closeMessage,
    };
};