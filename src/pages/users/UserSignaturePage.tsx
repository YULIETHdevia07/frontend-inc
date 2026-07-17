import { Box, Typography } from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import UserSignatureUploader from "../../components/users/UserSignatureUploader";

// Página para que el usuario registre su firma.
const UserSignaturePage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Mi firma"
                subtitle="Registra tu firma para que aparezca en las aprobaciones de requisiciones."
            />

            <Box
                sx={{
                    maxWidth: "720px",
                }}
            >
                <UserSignatureUploader />

                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        color: "text.secondary",
                    }}
                >
                    Una vez registrada, la firma no podrá ser modificada desde
                    esta opción.
                </Typography>
            </Box>
        </PageContainer>
    );
};

export default UserSignaturePage;