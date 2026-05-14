import * as Yup from "yup";

export const responsePqrSchema = Yup.string()
    .trim()
    .required("Debes escribir una respuesta antes de enviarla.")
    .min(3, "La respuesta debe tener mínimo 3 caracteres.")
    .max(500, "La respuesta no puede superar los 500 caracteres.");

export const createPqrSchema = Yup.object({
    caseType: Yup.string()
        .trim()
        .required("Debes seleccionar el tipo de caso."),

    description: Yup.string()
        .trim()
        .required("La descripción es obligatoria.")
        .min(3, "La descripción debe tener mínimo 3 caracteres.")
        .max(500, "La descripción no puede superar los 500 caracteres."),
});