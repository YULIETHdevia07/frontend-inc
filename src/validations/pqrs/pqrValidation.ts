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
        .required("Campo obligatorio."),

    description: Yup.string()
        .trim()
        .required("Campo obligatorio.")
        .min(3, "Mínimo 3 caracteres.")
        .max(500, "Maximo 500 caracteres."),

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