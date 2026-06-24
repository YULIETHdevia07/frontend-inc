import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import type { User, UserRole } from "../../interfaces/users/user.interface";
import { userRoles } from "../../data/userRoles";
import { getUserRoleLabel } from "../../utils/users/userRoleUtils";
import UserRoleChip from "./UserRoleChip";

interface ChangeUserRoleDialogProps {
    open: boolean;
    selectedUser: User | null;
    selectedRole: UserRole;
    updatingUserId: number | null;
    onClose: () => void;
    onRoleChange: (role: UserRole) => void;
    onSave: () => void;
}

// Modal para cambiar el rol de un usuario
const ChangeUserRoleDialog = ({
    open,
    selectedUser,
    selectedRole,
    updatingUserId,
    onClose,
    onRoleChange,
    onSave,
}: ChangeUserRoleDialogProps) => {
    // Captura el rol seleccionado en el select
    const handleRoleChange = (event: SelectChangeEvent) => {
        onRoleChange(event.target.value as UserRole);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "24px",
                        padding: 0,
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    padding: "28px 28px 0",
                    lineHeight: 1.3,
                }}
            >
                Cambiar rol
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    "&.MuiDialogContent-root": {
                        paddingTop: "24px",
                    },
                }}
            >
                {selectedUser && (
                    <>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    letterSpacing: "0.07em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                    color: "text.disabled",
                                }}
                            >
                                Usuario
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    color: "text.primary",
                                }}
                            >
                                {selectedUser.name}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    color: "text.secondary",
                                }}
                            >
                                {selectedUser.email}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    letterSpacing: "0.07em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                    color: "text.disabled",
                                }}
                            >
                                Rol actual
                            </Typography>

                            <UserRoleChip role={selectedUser.role} />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    letterSpacing: "0.07em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                    color: "text.disabled",
                                }}
                            >
                                Nuevo rol
                            </Typography>

                            <Select
                                fullWidth
                                size="small"
                                value={selectedRole}
                                onChange={handleRoleChange}
                                sx={{
                                    fontSize: "14px",
                                    borderRadius: "8px",
                                    backgroundColor: "action.hover",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "divider",
                                    },
                                }}
                            >
                                {userRoles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {getUserRoleLabel(role)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    padding: "0 28px 28px",
                    gap: "10px",
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        flex: 1,
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "text.secondary",
                        border: "1px solid",
                        borderColor: "divider",
                        padding: "10px",
                    }}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={
                        !selectedUser ||
                        selectedRole === selectedUser?.role ||
                        updatingUserId === selectedUser?.id
                    }
                    sx={{
                        flex: 2,
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: 500,
                        fontSize: "13px",
                        padding: "10px",
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    {updatingUserId === selectedUser?.id
                        ? "Guardando..."
                        : "Guardar cambios"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeUserRoleDialog;