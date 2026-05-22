import type { Theme } from "@mui/material/styles";

// Estilos reutilizables para buscadores, filtros y botones de acción.
export const getFilterStyles = (theme: Theme) => ({
    searchInput: {
        width: {
            xs: "100%",
            sm: "280px",
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: theme.palette.background.paper,
        },
    },

    iconButton: {
        borderRadius: "12px",
        backgroundColor: "#f1f5f9",
        color: "#334155",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
        },
    },

    activeIconButton: {
        borderRadius: "12px",
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
        },
    },

    filterMenuPaper: {
        width: {
            xs: 300,
            sm: 340,
        },
        p: 1,
        borderRadius: "16px",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.14)",
    },

    smallFilterMenuPaper: {
        width: 240,
        p: 1,
        borderRadius: "14px",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.14)",
    },

    filterMenuContent: {
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
    },

    smallFilterMenuContent: {
        p: 1,
    },

    filterTitle: {
        fontWeight: 800,
        color: theme.palette.text.primary,
    },

    smallFilterTitle: {
        fontWeight: 800,
        mb: 1,
        color: theme.palette.text.primary,
    },

    filterSelect: {
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
    },

    filterDateInput: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
        },
    },

    filterDateRow: {
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
        },
        gap: 1,
    },

    clearFilterButton: {
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 700,
    },

    clearFilterButtonWithMargin: {
        mt: 1,
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 700,
    },
});