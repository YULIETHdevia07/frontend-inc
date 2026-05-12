import { Box } from "@mui/material";

type PageContainerProps = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <Box
      sx={{
        padding: "2rem",
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "background.default",
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;