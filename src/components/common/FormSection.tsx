import { Box, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

// Sección reutilizable para agrupar campos dentro de un formulario.
const FormSection = ({ title, children }: FormSectionProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "background.paper",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        color: "text.primary",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Box
                sx={{
                    p: 2,
                }}
            >
                {children}
            </Box>
        </Paper>
    );
};

export default FormSection;