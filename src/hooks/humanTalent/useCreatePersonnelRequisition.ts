import { useEffect, useState } from "react";
import { ValidationError } from "yup";

import { getCities } from "../../services/common/cityService";
import {
    createPersonnelRequisition,
    getDepartments,
    getPositionProfiles,
} from "../../services/humanTalent/personnelRequisitionService";

import { createPersonnelRequisitionSchema } from "../../validations/humanTalent/personnelRequisitionValidation";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

import type {
    ContractType,
    CreatePersonnelRequisitionFormErrors,
    Department,
    DirectContractType,
    InternContractType,
    PositionProfile,
    RequisitionReason,
} from "../../interfaces/humanTalent/personnelRequisition.interface";
import type { City } from "../../interfaces/common/city.interface";
import { cleanNumberInput } from "../../utils/common/numberUtils";

// Estado inicial de los errores del formulario.
const initialFormErrors: CreatePersonnelRequisitionFormErrors = {
    departmentId: "",
    positionId: "",
    reason: "",
    otherReason: "",
    cityId: "",
    contractType: "",
    directContractType: "",
    contractDurationMonths: "",
    internContractType: "",
    proposedSalary: "",
};

// Hook encargado de manejar la lógica para crear una requisición de personal.
export const useCreatePersonnelRequisition = () => {
    // Área solicitante seleccionada.
    const [departmentId, setDepartmentId] = useState("");

    // Cargo requerido seleccionado.
    const [positionId, setPositionId] = useState("");

    // Motivo de la requisición seleccionado.
    const [reason, setReason] = useState<RequisitionReason | "">("");

    // Descripción del motivo cuando se selecciona OTROS.
    const [otherReason, setOtherReason] = useState("");

    // Ciudad seleccionada.
    const [cityId, setCityId] = useState("");

    // Tipo principal de contratación seleccionado.
    const [contractType, setContractType] = useState<ContractType | "">("");

    // Tipo de contrato directo seleccionado.
    const [directContractType, setDirectContractType] =
        useState<DirectContractType | "">("");

    // Duración del contrato en meses.
    const [contractDurationMonths, setContractDurationMonths] = useState("");

    // Tipo de practicante seleccionado.
    const [internContractType, setInternContractType] =
        useState<InternContractType | "">("");

    // Salario propuesto escrito por el usuario.
    const [proposedSalary, setProposedSalary] = useState("");

    // Listado de áreas activas.
    const [departments, setDepartments] = useState<Department[]>([]);

    // Listado de perfiles de cargo activos.
    const [positionProfiles, setPositionProfiles] = useState<PositionProfile[]>(
        []
    );

    // Listado de ciudades activas.
    const [cities, setCities] = useState<City[]>([]);

    // Controla la carga inicial de datos del formulario.
    const [loadingData, setLoadingData] = useState(false);

    // Controla el envío del formulario.
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Mensaje de éxito al crear la requisición.
    const [message, setMessage] = useState("");

    // Controla si se muestra el mensaje visual de éxito.
    const [openMessage, setOpenMessage] = useState(false);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<CreatePersonnelRequisitionFormErrors>(initialFormErrors);

    // Limpia mensajes generales y el error del campo que se está editando.
    const clearFieldError = (
        field: keyof CreatePersonnelRequisitionFormErrors
    ) => {
        setMessage("");
        setOpenMessage(false);
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Carga las áreas, cargos y ciudades necesarias para el formulario.
    const loadFormData = async () => {
        try {
            setLoadingData(true);
            setError("");

            const [departmentsResponse, positionProfilesResponse, citiesResponse] =
                await Promise.all([
                    getDepartments(),
                    getPositionProfiles(),
                    getCities(),
                ]);

            setDepartments(departmentsResponse.departments);
            setPositionProfiles(positionProfilesResponse.positionProfiles);
            setCities(citiesResponse.cities);
        } catch (error: unknown) {
            console.error(error);
            setError(
                getErrorMessage(
                    error,
                    "Error al cargar los datos del formulario."
                )
            );
        } finally {
            setLoadingData(false);
        }
    };

    // Actualiza el área solicitante.
    const handleDepartmentChange = (value: string) => {
        setDepartmentId(value);
        clearFieldError("departmentId");
    };

    // Actualiza el cargo requerido.
    const handlePositionChange = (value: string) => {
        setPositionId(value);
        clearFieldError("positionId");
    };

    // Actualiza el motivo de la requisición.
    const handleReasonChange = (value: string) => {
        setReason(value as RequisitionReason | "");

        if (value !== "OTROS") {
            setOtherReason("");
        }

        clearFieldError("reason");
        clearFieldError("otherReason");
    };

    // Actualiza la descripción cuando el motivo es OTROS.
    const handleOtherReasonChange = (value: string) => {
        setOtherReason(value);
        clearFieldError("otherReason");
    };

    // Actualiza la ciudad.
    const handleCityChange = (value: string) => {
        setCityId(value);
        clearFieldError("cityId");
    };

    // Actualiza el tipo principal de contratación.
    const handleContractTypeChange = (value: string) => {
        setContractType(value as ContractType | "");

        setDirectContractType("");
        setContractDurationMonths("");
        setInternContractType("");

        clearFieldError("contractType");
        clearFieldError("directContractType");
        clearFieldError("contractDurationMonths");
        clearFieldError("internContractType");
    };

    // Actualiza el tipo de contrato directo.
    const handleDirectContractTypeChange = (value: string) => {
        setDirectContractType(value as DirectContractType | "");

        if (value !== "FIJO") {
            setContractDurationMonths("");
        }

        clearFieldError("directContractType");
        clearFieldError("contractDurationMonths");
    };

    // Actualiza la duración del contrato en meses.
    const handleContractDurationMonthsChange = (value: string) => {
        setContractDurationMonths(value);
        clearFieldError("contractDurationMonths");
    };

    // Actualiza el tipo de practicante.
    const handleInternContractTypeChange = (value: string) => {
        setInternContractType(value as InternContractType | "");
        clearFieldError("internContractType");
    };

    // Actualiza el salario propuesto dejando solo números.
    const handleProposedSalaryChange = (value: string) => {
        setProposedSalary(cleanNumberInput(value));
        clearFieldError("proposedSalary");
    };

    // Cierra el mensaje visual de éxito.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Limpia el formulario y reinicia los mensajes visuales.
    const resetForm = () => {
        setDepartmentId("");
        setPositionId("");
        setReason("");
        setOtherReason("");
        setCityId("");
        setContractType("");
        setDirectContractType("");
        setContractDurationMonths("");
        setInternContractType("");
        setProposedSalary("");

        setFormErrors(initialFormErrors);
        setError("");
        setMessage("");
        setOpenMessage(false);
    };

    // Indica si el formulario tiene al menos un campo diligenciado.
    const hasFormChanges =
        departmentId !== "" ||
        positionId !== "" ||
        reason !== "" ||
        otherReason !== "" ||
        cityId !== "" ||
        contractType !== "" ||
        directContractType !== "" ||
        contractDurationMonths !== "" ||
        internContractType !== "" ||
        proposedSalary !== "";

    // Crea una nueva requisición de personal usando validación Yup.
    const handleCreatePersonnelRequisition = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const formData = {
            departmentId,
            positionId,
            reason,
            otherReason,
            cityId,
            contractType,
            directContractType,
            contractDurationMonths,
            internContractType,
            proposedSalary,
        };

        try {
            await createPersonnelRequisitionSchema.validate(formData, {
                abortEarly: false,
            });

            setLoadingSubmit(true);
            setFormErrors(initialFormErrors);
            setError("");
            setMessage("");
            setOpenMessage(false);

            const response = await createPersonnelRequisition({
                departmentId: Number(departmentId),
                positionId: Number(positionId),
                reason: reason as RequisitionReason,
                otherReason:
                    reason === "OTROS" ? otherReason.trim() : null,
                cityId: Number(cityId),
                contractType: contractType as ContractType,
                directContractType:
                    contractType === "DIRECTO"
                        ? (directContractType as DirectContractType)
                        : null,
                contractDurationMonths:
                    contractType === "TEMPORAL" ||
                        (contractType === "DIRECTO" &&
                            directContractType === "FIJO")
                        ? Number(contractDurationMonths)
                        : null,
                internContractType:
                    contractType === "PRACTICANTE"
                        ? (internContractType as InternContractType)
                        : null,
                proposedSalary: Number(proposedSalary),
            });

            resetForm();

            setMessage(
                response.message ||
                "Requisición de personal creada correctamente."
            );
            setOpenMessage(true);
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: CreatePersonnelRequisitionFormErrors = {
                    ...initialFormErrors,
                };

                error.inner.forEach((validationError) => {
                    const path =
                        validationError.path as keyof CreatePersonnelRequisitionFormErrors;

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
            setError(
                getErrorMessage(
                    error,
                    "Error al crear la requisición de personal."
                )
            );
            setMessage("");
            setOpenMessage(false);
        } finally {
            setLoadingSubmit(false);
        }
    };

    useEffect(() => {
        loadFormData();
    }, []);

    return {
        departmentId,
        positionId,
        reason,
        otherReason,
        cityId,
        contractType,
        directContractType,
        contractDurationMonths,
        internContractType,
        proposedSalary,

        departments,
        positionProfiles,
        cities,

        loadingData,
        loadingSubmit,
        hasFormChanges,

        message,
        openMessage,
        error,
        formErrors,

        handleDepartmentChange,
        handlePositionChange,
        handleReasonChange,
        handleOtherReasonChange,
        handleCityChange,
        handleContractTypeChange,
        handleDirectContractTypeChange,
        handleContractDurationMonthsChange,
        handleInternContractTypeChange,
        handleProposedSalaryChange,
        handleCreatePersonnelRequisition,
        closeMessage,
        resetForm,
    };
};