import { useState } from "react";
import { ValidationError } from "yup";
import { createPqr } from "../services/pqrService";
import { createPqrSchema } from "../validations/pqrValidation";
import type { CreatePqrFormErrors } from "../interfaces/pqr.interface";
import { getErrorMessage } from "../utils/getErrorMessage";

// Estado inicial de los errores del formulario.
const initialFormErrors: CreatePqrFormErrors = {
    caseType: "",
    description: "",
    file: "",
};

// Hook encargado de manejar la lógica para crear una PQR.
export const useCreatePqr = () => {
    // Tipo de caso seleccionado.
    const [caseType, setCaseType] = useState("");

    // Descripción escrita por el usuario.
    const [description, setDescription] = useState("");

    // Archivo opcional adjunto a la PQR.
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    // Guarda el archivo seleccionado.
    const handleFileChange = (file: File | null) => {
        setMessage("");
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            file: "",
        }));

        setSelectedFile(file);
    };

    // Quita el archivo seleccionado.
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            file: "",
        }));
    };

    // Crea una nueva PQR usando validación Yup.
    const handleCreatePqr = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            caseType,
            description,
            file: selectedFile,
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
                ...(selectedFile && {
                    file: selectedFile,
                }),
            });

            setCaseType("");
            setDescription("");
            setSelectedFile(null);

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
            setError(getErrorMessage(error, "Error al crear la PQR."));
            setMessage("");
        }
    };

    return {
        caseType,
        description,
        selectedFile,

        message,
        error,
        formErrors,

        handleCaseTypeChange,
        handleDescriptionChange,
        handleFileChange,
        handleRemoveFile,
        handleCreatePqr,
    };
};