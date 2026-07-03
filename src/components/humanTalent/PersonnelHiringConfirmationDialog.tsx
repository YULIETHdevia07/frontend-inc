import {
    Alert,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

import ActionButton from "../common/ActionButton";

import type {
    PersonnelRequisition,
} from "../../interfaces/humanTalent/personnelRequisition.interface";

interface HiringConfirmationForm {
    contractType: string;
    directContractType: string;
    contractDurationMonths: string;
    internContractType: string;
    approvedSalary: string;
}

interface PersonnelHiringConfirmationDialogProps {
    open: boolean;
    loading: boolean;
    requisition: PersonnelRequisition | null;
    form: HiringConfirmationForm;
    isValid: boolean;
    onChange: (field: keyof HiringConfirmationForm, value: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

// Modal para registrar la confirmación final de contratación.
const PersonnelHiringConfirmationDialog = ({
    open,
    loading,
    requisition,
    form,
    isValid,
    onChange,
    onClose,
    onConfirm,
}: PersonnelHiringConfirmationDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                Confirmar contratación
            </DialogTitle>

            <DialogContent>
                {requisition && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {requisition.position.name} -{" "}
                        {requisition.department.name}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        mt: 1,
                    }}
                >
                    <FormControl fullWidth>
                        <InputLabel>Tipo de contrato</InputLabel>
                        <Select
                            label="Tipo de contrato"
                            value={form.contractType}
                            onChange={(event) =>
                                onChange(
                                    "contractType",
                                    String(event.target.value)
                                )
                            }
                        >
                            <MenuItem value="DIRECTO">Directo</MenuItem>
                            <MenuItem value="TEMPORAL">Temporal</MenuItem>
                            <MenuItem value="PRACTICANTE">
                                Practicante
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {form.contractType === "DIRECTO" && (
                        <FormControl fullWidth>
                            <InputLabel>Tipo contrato directo</InputLabel>
                            <Select
                                label="Tipo contrato directo"
                                value={form.directContractType}
                                onChange={(event) =>
                                    onChange(
                                        "directContractType",
                                        String(event.target.value)
                                    )
                                }
                            >
                                <MenuItem value="INDEFINIDO">
                                    Indefinido
                                </MenuItem>
                                <MenuItem value="FIJO">Fijo</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {(form.contractType === "TEMPORAL" ||
                        (form.contractType === "DIRECTO" &&
                            form.directContractType === "FIJO")) && (
                            <TextField
                                label="Duración en meses"
                                value={form.contractDurationMonths}
                                onChange={(event) =>
                                    onChange(
                                        "contractDurationMonths",
                                        event.target.value
                                    )
                                }
                                fullWidth
                            />
                        )}

                    {form.contractType === "PRACTICANTE" && (
                        <FormControl fullWidth>
                            <InputLabel>Tipo de practicante</InputLabel>
                            <Select
                                label="Tipo de practicante"
                                value={form.internContractType}
                                onChange={(event) =>
                                    onChange(
                                        "internContractType",
                                        String(event.target.value)
                                    )
                                }
                            >
                                <MenuItem value="APRENDIZ">Aprendiz</MenuItem>
                                <MenuItem value="PASANTE">Pasante</MenuItem>
                                <MenuItem value="ROTANTE">Rotante</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    <TextField
                        label="Salario aprobado"
                        value={form.approvedSalary}
                        onChange={(event) =>
                            onChange("approvedSalary", event.target.value)
                        }
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <ActionButton
                    actionType="cancel"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancelar
                </ActionButton>

                <ActionButton
                    actionType="save"
                    loading={loading}
                    loadingText="Guardando..."
                    disabled={!isValid}
                    onClick={onConfirm}
                >
                    Guardar
                </ActionButton>
            </DialogActions>
        </Dialog>
    );
};

export default PersonnelHiringConfirmationDialog;