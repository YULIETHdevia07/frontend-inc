import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface FormGridProps {
    children: ReactNode;
    columns?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
    };
}

// Grid reutilizable para organizar campos de formularios.
const FormGrid = ({ children, columns }: FormGridProps) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: columns?.xs || "1fr",
                    sm: columns?.sm || "1fr 1fr",
                    md: columns?.md || "repeat(3, 1fr)",
                    lg: columns?.lg || "repeat(4, 1fr)",
                    xl: columns?.xl || "repeat(5, 1fr)",
                },
                gap: 2,
                alignItems: "flex-start",
            }}
        >
            {children}
        </Box>
    );
};

export default FormGrid;