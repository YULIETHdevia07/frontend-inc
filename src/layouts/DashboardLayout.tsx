import { useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <SidebarMenu openSidebar={openSidebar} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.default",
          overflow: "hidden",
        }}
      >
        <Header
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;