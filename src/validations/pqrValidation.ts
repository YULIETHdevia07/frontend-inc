import * as Yup from "yup";

const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];

const maxFileSize = 5 * 1024 * 1024;

export const createPqrSchema = Yup.object({
    caseType: Yup.string()
        .trim()
        .required("Debes seleccionar el tipo de caso."),

    description: Yup.string()
        .trim()
        .required("La descripción es obligatoria.")
        .min(3, "La descripción debe tener mínimo 3 caracteres.")
        .max(500, "La descripción no puede superar los 500 caracteres."),

    file: Yup.mixed<File>()
        .nullable()
        .test(
            "fileType",
            "Solo se permiten imágenes JPG, PNG, WEBP o PDF.",
            (file) => {
                if (!file) return true;

                return allowedFileTypes.includes(file.type);
            }
        )
        .test(
            "fileSize",
            "El archivo no puede superar los 5 MB.",
            (file) => {
                if (!file) return true;

                return file.size <= maxFileSize;
            }
        ),
});