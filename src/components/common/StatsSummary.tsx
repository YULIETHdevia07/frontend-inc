import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

type StatsSummaryItem = {
    label: string;
    value: number | string;
    icon: ReactNode;
};

type StatsSummaryProps = {
    items: StatsSummaryItem[];
};

const StatsSummary = ({ items }: StatsSummaryProps) => {
    const theme = useTheme();

    const style = {
        grid: {
            mb: 2,
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr 1fr",
                md: `repeat(${items.length}, 1fr)`,
            },
            gap: 1.2,
        },

        card: {
            p: 1.5,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
            display: "flex",
            alignItems: "center",
            gap: 1.2,
        },

        iconBox: {
            width: 38,
            height: 38,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            flexShrink: 0,
        },

        label: {
            color: theme.palette.text.secondary,
            fontSize: "0.78rem",
            fontWeight: 700,
            lineHeight: 1.2,
        },

        value: {
            color: theme.palette.text.primary,
            fontWeight: 900,
            lineHeight: 1,
        },
    };

    return (
        <Box sx={style.grid}>
            {items.map((item) => (
                <Paper key={item.label} sx={style.card}>
                    <Box sx={style.iconBox}>{item.icon}</Box>

                    <Box>
                        <Typography sx={style.label}>
                            {item.label}
                        </Typography>

                        <Typography variant="h6" sx={style.value}>
                            {item.value}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default StatsSummary;