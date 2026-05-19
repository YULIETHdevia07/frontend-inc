import {
    Avatar,
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

import type { User, UserRole } from "../../interfaces/user.interface";
import { userRoles } from "../../data/userRoles";
import { getUserRoleLabel } from "../../utils/userRoleUtils";
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
                        borderRadius: "22px",
                        padding: "4px",
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 800,
                    paddingBottom: "8px",
                }}
            >
                Cambiar rol de usuario
            </DialogTitle>

            <DialogContent>
                {selectedUser && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "18px",
                            marginTop: "8px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "16px",
                                borderRadius: "16px",
                                backgroundColor: "#f8fafc",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: "#e8f1ff",
                                    color: "primary.main",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                }}
                            >
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </Avatar>

                            <Box>
                                <Typography sx={{ fontWeight: 800 }}>
                                    {selectedUser.name}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {selectedUser.email}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#64748b",
                                    marginBottom: "8px",
                                }}
                            >
                                Rol actual
                            </Typography>

                            <UserRoleChip role={selectedUser.role} />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#64748b",
                                    marginBottom: "8px",
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
                                    minWidth: "170px",
                                    backgroundColor: "background.paper",
                                    borderRadius: "12px",
                                }}
                            >
                                {userRoles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {getUserRoleLabel(role)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    padding: "16px 24px 20px",
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        textTransform: "none",
                        borderRadius: "12px",
                        fontWeight: 700,
                        color: "#64748b",
                    }}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={
                        !selectedUser ||
                        selectedRole === selectedUser.role ||
                        updatingUserId === selectedUser.id
                    }
                    sx={{
                        textTransform: "none",
                        borderRadius: "12px",
                        fontWeight: 700,
                        boxShadow: "none",
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