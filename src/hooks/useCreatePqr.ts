import { useState } from "react";
import { ValidationError } from "yup";
import { createPqr } from "../services/pqrService";
import { createPqrSchema } from "../validations/pqrValidation";
import type { CreatePqrFormErrors } from "../interfaces/pqr.interface";

// Estado inicial de los errores del formulario.
const initialFormErrors: CreatePqrFormErrors = {
    caseType: "",
    description: "",
};

// Hook encargado de manejar la lógica para crear una PQR.
export const useCreatePqr = () => {
    // Tipo de caso seleccionado.
    const [caseType, setCaseType] = useState("");

    // Descripción escrita por el usuario.
    const [description, setDescription] = useState("");

    // Mensaje de éxito al crear la PQR.
    const [message, setMessage] = useState("");

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<CreatePqrFormErrors>(initialFormErrors);

    // Limpia mensajes generales y el error del campo que se está editando.
    const clearFieldError = (field: keyof CreatePqrFormErrors) => {
        setMessage("");
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Actualiza el tipo de caso.
    const handleCaseTypeChange = (value: string) => {
        setCaseType(value);
        clearFieldError("caseType");
    };

    // Actualiza la descripción.
    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        clearFieldError("description");
    };

    // Crea una nueva PQR usando validación Yup.
    const handleCreatePqr = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            caseType,
            description,
        };

        try {
            await createPqrSchema.validate(formData, {
                abortEarly: false,
            });

            setFormErrors(initialFormErrors);
            setError("");
            setMessage("");

            await createPqr({
                caseType: caseType.trim(),
                description: description.trim(),
            });

            setCaseType("");
            setDescription("");

            setMessage("PQR creada correctamente.");
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: CreatePqrFormErrors = {
                    ...initialFormErrors,
                };

                error.inner.forEach((validationError) => {
                    const path = validationError.path as keyof CreatePqrFormErrors;

                    if (path) {
                        errors[path] = validationError.message;
                    }
                });

                setFormErrors(errors);
                setMessage("");
                return;
            }

            console.error(error);
            setError("Error al crear la PQR.");
            setMessage("");
        }
    };

    return {
        caseType,
        description,

        message,
        error,
        formErrors,

        handleCaseTypeChange,
        handleDescriptionChange,
        handleCreatePqr,
    };
};