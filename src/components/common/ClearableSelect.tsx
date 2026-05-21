import {
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

interface SelectOption {
    label: string;
    value: string;
}

interface ClearableSelectProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    size?: "small" | "medium";
    minWidth?: string;
    placeholder?: string;
    clearable?: boolean;
}

const ClearableSelect = ({
    label,
    value,
    options,
    onChange,
    error = "",
    required = false,
    disabled = false,
    size = "medium",
    minWidth = "220px",
    placeholder,
    clearable = false,
}: ClearableSelectProps) => {
    const theme = useTheme();

    return (
        <FormControl
            fullWidth
            required={required}
            disabled={disabled}
            error={!!error}
            size={size}
            sx={{
                minWidth,
                position: "relative",
            }}
        >
            <InputLabel required={required}>{label}</InputLabel>

            <Select
                label={label}
                value={value}
                required={required}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    pr: clearable && value ? 5 : 0,
                }}
            >
                <MenuItem value="">
                    <em>{placeholder}</em>
                </MenuItem>

                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>

            {clearable && value && !disabled && (
                <IconButton
                    size="small"
                    disabled={disabled}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onChange("")}
                    sx={{
                        position: "absolute",
                        right: 32,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        color: theme.palette.text.secondary,
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}

            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default ClearableSelect;