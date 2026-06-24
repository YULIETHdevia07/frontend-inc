import { useState } from "react";
import { ValidationError } from "yup";
import { createPqr } from "../../services/pqrs/pqrService";
import { createPqrSchema } from "../../validations/pqrs/pqrValidation";
import type { CreatePqrFormErrors } from "../../interfaces/pqrs/pqr.interface";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

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

    // Controla si se muestra el mensaje visual de éxito.
    const [openMessage, setOpenMessage] = useState(false);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<CreatePqrFormErrors>(initialFormErrors);

    // Limpia mensajes generales y el error del campo que se está editando.
    const clearFieldError = (field: keyof CreatePqrFormErrors) => {
        setMessage("");
        setOpenMessage(false);
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
        setOpenMessage(false);
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

    // Cierra el mensaje visual de éxito.
    const closeMessage = () => {
        setOpenMessage(false);
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
            setOpenMessage(false);

            const response = await createPqr({
                caseType: caseType.trim(),
                description: description.trim(),
                ...(selectedFile && {
                    file: selectedFile,
                }),
            });

            setCaseType("");
            setDescription("");
            setSelectedFile(null);

            setMessage(response.message || "PQR creada correctamente.");
            setOpenMessage(true);
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
                setOpenMessage(false);
                return;
            }

            console.error(error);
            setError(getErrorMessage(error, "Error al crear la PQR."));
            setMessage("");
            setOpenMessage(false);
        }
    };

    return {
        caseType,
        description,
        selectedFile,

        message,
        openMessage,
        error,
        formErrors,

        handleCaseTypeChange,
        handleDescriptionChange,
        handleFileChange,
        handleRemoveFile,
        handleCreatePqr,
        closeMessage,
    };
};