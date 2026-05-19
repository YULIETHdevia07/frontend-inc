import { Box } from "@mui/material";

type PageContainerProps = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;