import { Box, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionCardProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}

const SectionCard = ({
    title,
    subtitle,
    actions,
    children,
}: SectionCardProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "background.paper",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
                p: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                    gap: 2,
                    // flexWrap: "wrap",
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {actions}
            </Box>

            {children}
        </Paper>
    );
};

export default SectionCard;