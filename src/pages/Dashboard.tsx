import { Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <>
      <Typography
        sx={{
          fontSize: "1.8rem",
          fontWeight: 700,
          marginBottom: "1rem",
        }}
      >
        Panel principal
      </Typography>

      <Typography>
        Bienvenido. Aquí se mostrará el contenido principal del sistema.
      </Typography>
    </>
  );
};

export default Dashboard;