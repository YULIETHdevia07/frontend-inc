import {
    Button,
    CircularProgress,
    Tooltip,
    useMediaQuery,
} from "@mui/material";
import type { ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

type ActionButtonType =
    | "save"
    | "edit"
    | "cancel"
    | "approve"
    | "reject"
    | "delete"
    | "view"
    | "create"
    | "send"
    | "clear"
    | "custom";

interface ActionButtonProps extends ButtonProps {
    actionType?: ActionButtonType;
    loading?: boolean;
    loadingText?: string;
    iconOnlyOnMobile?: boolean;
    fullWidthOnMobile?: boolean;
    tooltip?: string;
}

// Botón general reutilizable para acciones principales del sistema.
const ActionButton = ({
    actionType = "custom",
    loading = false,
    loadingText = "Procesando...",
    iconOnlyOnMobile = false,
    fullWidthOnMobile = false,
    tooltip,
    disabled,
    children,
    startIcon,
    variant,
    color,
    size = "small",
    sx,
    ...props
}: ActionButtonProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const getDefaultIcon = () => {
        if (actionType === "save") return <SaveOutlinedIcon />;
        if (actionType === "edit") return <EditOutlinedIcon />;
        if (actionType === "cancel") return <CloseOutlinedIcon />;
        if (actionType === "approve") return <CheckCircleOutlineOutlinedIcon />;
        if (actionType === "reject") return <CancelOutlinedIcon />;
        if (actionType === "delete") return <DeleteOutlineOutlinedIcon />;
        if (actionType === "view") return <VisibilityOutlinedIcon />;
        if (actionType === "create") return <AddCircleOutlineOutlinedIcon />;
        if (actionType === "send") return <SendOutlinedIcon />;
        if (actionType === "clear") return <RestartAltOutlinedIcon />;

        return startIcon;
    };

    const getDefaultColor = (): ButtonProps["color"] => {
        if (color) return color;

        if (actionType === "reject" || actionType === "delete") {
            return "error";
        }

        if (actionType === "approve" || actionType === "save") {
            return "primary";
        }

        if (actionType === "cancel" || actionType === "clear") {
            return "inherit";
        }

        return "primary";
    };

    const getDefaultVariant = (): ButtonProps["variant"] => {
        if (variant) return variant;

        if (
            actionType === "cancel" ||
            actionType === "reject" ||
            actionType === "delete" ||
            actionType === "clear"
        ) {
            return "outlined";
        }

        return "contained";
    };

    const buttonText =
        loading && loadingText
            ? loadingText
            : iconOnlyOnMobile && isMobile
                ? ""
                : children;

    const button = (
        <Button
            {...props}
            size={size}
            variant={getDefaultVariant()}
            color={getDefaultColor()}
            disabled={disabled || loading}
            startIcon={
                loading ? (
                    <CircularProgress size={16} color="inherit" />
                ) : (
                    getDefaultIcon()
                )
            }
            sx={{
                minWidth: iconOnlyOnMobile && isMobile ? 40 : undefined,
                width: fullWidthOnMobile && isMobile ? "100%" : undefined,
                whiteSpace: "nowrap",

                "& .MuiButton-startIcon": {
                    marginRight: iconOnlyOnMobile && isMobile ? 0 : undefined,
                    marginLeft: iconOnlyOnMobile && isMobile ? 0 : undefined,
                },

                ...sx,
            }}
        >
            {buttonText}
        </Button>
    );

    if (tooltip || (iconOnlyOnMobile && isMobile && children)) {
        return (
            <Tooltip title={tooltip || String(children)}>
                <span>{button}</span>
            </Tooltip>
        );
    }

    return button;
};

export default ActionButton;