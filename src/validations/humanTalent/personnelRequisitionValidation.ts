import * as Yup from "yup";

export const createPersonnelRequisitionSchema = Yup.object({
    departmentId: Yup.string()
        .trim()
        .required("Campo obligatorio."),

    positionId: Yup.string()
        .trim()
        .required("Campo obligatorio."),

    reason: Yup.string()
        .trim()
        .required("Campo obligatorio."),

    otherReason: Yup.string()
        .trim()
        .when("reason", {
            is: "OTROS",
            then: (schema) =>
                schema
                    .required("Campo obligatorio.")
                    .min(3, "Mínimo 3 caracteres.")
                    .max(300, "Máximo 300 caracteres."),
            otherwise: (schema) => schema.notRequired(),
        }),

    cityId: Yup.string()
        .trim()
        .required("Campo obligatorio."),

    contractType: Yup.string()
        .trim()
        .required("Campo obligatorio."),

    directContractType: Yup.string()
        .trim()
        .when("contractType", {
            is: "DIRECTO",
            then: (schema) => schema.required("Campo obligatorio."),
            otherwise: (schema) => schema.notRequired(),
        }),

    contractDurationMonths: Yup.string()
        .trim()
        .when(["contractType", "directContractType"], {
            is: (contractType: string, directContractType: string) =>
                contractType === "TEMPORAL" ||
                (contractType === "DIRECTO" && directContractType === "FIJO"),
            then: (schema) =>
                schema
                    .required("Campo obligatorio.")
                    .test(
                        "isPositiveNumber",
                        "Debe ser mayor a cero.",
                        (value) => {
                            if (!value) return false;

                            return Number(value) > 0;
                        }
                    ),
            otherwise: (schema) => schema.notRequired(),
        }),

    internContractType: Yup.string()
        .trim()
        .when("contractType", {
            is: "PRACTICANTE",
            then: (schema) => schema.required("Campo obligatorio."),
            otherwise: (schema) => schema.notRequired(),
        }),

    proposedSalary: Yup.string()
        .trim()
        .required("Campo obligatorio.")
        .test(
            "isPositiveNumber",
            "Debe ser mayor a cero.",
            (value) => {
                if (!value) return false;

                return Number(value) > 0;
            }
        ),
});