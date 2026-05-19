import { Box, CircularProgress } from "@mui/material";

// Muestra un indicador de carga centrado
const LoadingBox = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingBox;