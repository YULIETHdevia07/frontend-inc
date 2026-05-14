import { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openSidebar, setOpenSidebar] = useState(true);

  const handleCloseSidebar = () => {
    if (isMobile) {
      setOpenSidebar(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      {/* Sidebar fijo en escritorio */}
      {!isMobile && (
        <Box
          sx={{
            width: openSidebar ? "280px" : "76px",
            height: "100vh",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            left: 0,
            overflow: "hidden",
            transition: "width 0.3s ease",
            zIndex: 1200,
          }}
        >
          <SidebarMenu openSidebar={openSidebar} />
        </Box>
      )}

      {/* Sidebar flotante en móvil */}
      {isMobile && (
        <Drawer
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          ModalProps={{
            keepMounted: true,
          }}
          slotProps={{
            paper: {
              sx: {
                width: "280px",
                height: "100vh",
                borderRadius: "0 18px 18px 0",
                overflow: "hidden",
              },
            },
          }}
        >
          <SidebarMenu openSidebar={true} onClose={handleCloseSidebar} />
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.default",
          overflow: "hidden",
        }}
      >
        {/* Header fijo arriba */}
        <Box
          sx={{
            flexShrink: 0,
            zIndex: 1100,
          }}
        >
          <Header
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
        </Box>

        {/* Solo esta parte hace scroll */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;