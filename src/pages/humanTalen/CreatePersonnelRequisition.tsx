import { Alert, Box, Button, TextField } from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

import PageHeader from "../../components/common/PageHeader";
import FormSection from "../../components/common/FormSection";
import FormGrid from "../../components/common/FormGrid";
import ClearableSelect from "../../components/common/ClearableSelect";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import LoadingBox from "../../components/common/LoadingBox";

import { useCreatePersonnelRequisition } from "../../hooks/humanTalent/useCreatePersonnelRequisition";

import {
    contractTypeOptions,
    directContractTypeOptions,
    internContractTypeOptions,
    requisitionReasonOptions,
} from "../../data/humanTalentOptions";

import { formatNumberInput } from "../../utils/common/numberUtils";

// Página donde el usuario crea una requisición de personal.
const CreatePersonnelRequisition = () => {
    const {
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
    } = useCreatePersonnelRequisition();

    const selectedPosition = positionProfiles.find(
        (position) => String(position.id) === positionId
    );

    const departmentOptions = departments.map((department) => ({
        label: department.name,
        value: String(department.id),
    }));

    const positionProfileOptions = positionProfiles.map((position) => ({
        label: position.name,
        value: String(position.id),
    }));

    const cityOptions = cities.map((city) => ({
        label: city.name,
        value: String(city.id),
    }));

    const showOtherReason = reason === "OTROS";

    const showDirectContractType = contractType === "DIRECTO";

    const showContractDuration =
        contractType === "TEMPORAL" ||
        (contractType === "DIRECTO" && directContractType === "FIJO");

    const showInternContractType = contractType === "PRACTICANTE";

    if (loadingData) {
        return <LoadingBox />;
    }

    return (
        <Box sx={{ width: "100%" }}>
            <PageHeader
                title="Crear requisición de personal"
                subtitle="Registra una solicitud de personal indicando el área, cargo, ciudad, motivo, tipo de contratación y salario propuesto."
                actions={
                    <>
                        <Button
                            variant="outlined"
                            startIcon={<RestartAltOutlinedIcon />}
                            onClick={resetForm}
                            disabled={!hasFormChanges || loadingSubmit}
                            sx={{
                                borderRadius: "8px",
                                fontWeight: 700,
                                textTransform: "none",
                            }}
                        >
                            Limpiar
                        </Button>

                        <Button
                            type="submit"
                            form="create-personnel-requisition-form"
                            variant="contained"
                            startIcon={<SaveOutlinedIcon />}
                            disabled={loadingSubmit}
                            sx={{
                                borderRadius: "8px",
                                fontWeight: 700,
                                textTransform: "none",
                            }}
                        >
                            {loadingSubmit
                                ? "Creando..."
                                : "Crear requisición"}
                        </Button>
                    </>
                }
            />

            {/* Mensaje para errores generales del backend. */}
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Formulario de creación de requisición de personal. */}
            <Box
                id="create-personnel-requisition-form"
                component="form"
                onSubmit={handleCreatePersonnelRequisition}
                noValidate
                sx={{
                    display: "grid",
                    gap: 2,
                }}
            >
                <FormSection title="Información de la solicitud">
                    <FormGrid
                        columns={{
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        }}
                    >
                        <ClearableSelect
                            label="Área solicitante"
                            value={departmentId}
                            required
                            clearable
                            options={departmentOptions}
                            error={formErrors.departmentId}
                            onChange={handleDepartmentChange}
                        />

                        <ClearableSelect
                            label="Cargo requerido"
                            value={positionId}
                            required
                            clearable
                            options={positionProfileOptions}
                            error={formErrors.positionId}
                            disabled={!departmentId}
                            onChange={handlePositionChange}
                        />

                        <TextField
                            fullWidth
                            label="Código del perfil de cargo"
                            value={selectedPosition?.code || ""}
                            disabled
                        />

                        <ClearableSelect
                            label="Ciudad"
                            value={cityId}
                            required
                            clearable
                            options={cityOptions}
                            error={formErrors.cityId}
                            onChange={handleCityChange}
                        />
                    </FormGrid>
                </FormSection>

                <FormSection title="Motivo de la requisición">
                    <FormGrid
                        columns={{
                            xs: "1fr",
                            md: showOtherReason
                                ? "repeat(2, minmax(0, 1fr))"
                                : "minmax(0, 1fr)",
                        }}
                    >
                        <ClearableSelect
                            label="Motivo"
                            value={reason}
                            required
                            clearable
                            options={requisitionReasonOptions}
                            error={formErrors.reason}
                            onChange={handleReasonChange}
                        />

                        {showOtherReason && (
                            <TextField
                                fullWidth
                                label="Especifique el motivo"
                                required
                                multiline
                                minRows={3}
                                value={otherReason}
                                error={Boolean(formErrors.otherReason)}
                                helperText={formErrors.otherReason}
                                onChange={(event) =>
                                    handleOtherReasonChange(event.target.value)
                                }
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 300,
                                    },
                                }}
                            />
                        )}
                    </FormGrid>
                </FormSection>

                <FormSection title="Requerimientos de contratación">
                    <FormGrid
                        columns={{
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(3, minmax(0, 1fr))",
                        }}
                    >
                        <ClearableSelect
                            label="Tipo de contratación"
                            value={contractType}
                            required
                            clearable
                            options={contractTypeOptions}
                            error={formErrors.contractType}
                            onChange={handleContractTypeChange}
                        />

                        {showDirectContractType && (
                            <ClearableSelect
                                label="Tipo de contrato directo"
                                value={directContractType}
                                required
                                clearable
                                options={directContractTypeOptions}
                                error={formErrors.directContractType}
                                onChange={handleDirectContractTypeChange}
                            />
                        )}

                        {showContractDuration && (
                            <TextField
                                fullWidth
                                label="Duración en meses"
                                type="number"
                                required
                                value={contractDurationMonths}
                                error={Boolean(
                                    formErrors.contractDurationMonths
                                )}
                                helperText={formErrors.contractDurationMonths}
                                onChange={(event) =>
                                    handleContractDurationMonthsChange(
                                        event.target.value
                                    )
                                }
                            />
                        )}

                        {showInternContractType && (
                            <ClearableSelect
                                label="Tipo de practicante"
                                value={internContractType}
                                required
                                clearable
                                options={internContractTypeOptions}
                                error={formErrors.internContractType}
                                onChange={handleInternContractTypeChange}
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Salario propuesto"
                            type="text"
                            required
                            value={formatNumberInput(proposedSalary)}
                            error={Boolean(formErrors.proposedSalary)}
                            helperText={formErrors.proposedSalary}
                            onChange={(event) =>
                                handleProposedSalaryChange(event.target.value)
                            }
                        />
                    </FormGrid>
                </FormSection>
            </Box>

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity="success"
                onClose={closeMessage}
            />
        </Box>
    );
};

export default CreatePersonnelRequisition;