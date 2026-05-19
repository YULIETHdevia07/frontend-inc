import { Paper, Typography } from "@mui/material";

interface EmptyStateProps {
  title: string;
  description?: string;
}

// Muestra un mensaje reutilizable cuando no existen datos
const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <Paper
      sx={{
        padding: "36px",
        borderRadius: "16px",
        textAlign: "center",
        backgroundColor: "background.paper",
        border: "1px solid #e5e7eb",
        boxShadow: "none",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Paper>
  );
};

export default EmptyState;