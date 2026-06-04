import type { ReactNode } from "react";
import { Box, Button } from "@mui/material";

type ViewToggleOption<T extends string> = {
    value: T;
    label: string;
    icon?: ReactNode;
    count?: number;
};

type ViewToggleButtonsProps<T extends string> = {
    value: T;
    options: ViewToggleOption<T>[];
    onChange: (value: T) => void;
};

const ViewToggleButtons = <T extends string>({
    value,
    options,
    onChange,
}: ViewToggleButtonsProps<T>) => {
    const style = {
        container: {
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
        },

        button: {
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 800,
            px: 2,
            minHeight: 38,
            boxShadow: "none",
        },
    };

    return (
        <Box sx={style.container}>
            {options.map((option) => {
                const isActive = value === option.value;

                return (
                    <Button
                        key={option.value}
                        variant={isActive ? "contained" : "outlined"}
                        startIcon={option.icon}
                        onClick={() => onChange(option.value)}
                        sx={style.button}
                    >
                        {option.label}
                        {typeof option.count === "number" &&
                            ` (${option.count})`}
                    </Button>
                );
            })}
        </Box>
    );
};

export default ViewToggleButtons;