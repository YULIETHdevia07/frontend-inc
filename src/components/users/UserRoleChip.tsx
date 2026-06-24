import { Chip } from "@mui/material";

import type { UserRole } from "../../interfaces/users/user.interface";
import {
    getUserRoleColor,
    getUserRoleIcon,
    getUserRoleLabel,
} from "../../utils/users/userRoleUtils";

interface UserRoleChipProps {
    role: UserRole;
}

// Muestra el rol del usuario con ícono, color y texto
const UserRoleChip = ({ role }: UserRoleChipProps) => {
    return (
        <Chip
            icon={getUserRoleIcon(role)}
            label={getUserRoleLabel(role)}
            color={getUserRoleColor(role)}
            size="small"
            variant="outlined"
            sx={{
                fontWeight: 700,
                borderRadius: "10px",
            }}
        />
    );
};

export default UserRoleChip;