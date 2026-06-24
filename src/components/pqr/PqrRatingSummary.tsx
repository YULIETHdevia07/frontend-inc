import { Box, Rating, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { formatDate } from "../../utils/common/dateUtils";

interface PqrRatingSummaryProps {
    rating?: number | null;
    ratingComment?: string | null;
    ratedAt?: string | null;
}

const PqrRatingSummary = ({
    rating,
    ratingComment,
    ratedAt,
}: PqrRatingSummaryProps) => {
    const theme = useTheme();

    if (rating === null || rating === undefined) {
        return null;
    }

    const style = {
        ratingBanner: {
            mt: 1.5,
            p: 1.5,
            borderRadius: 3,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.primary.light}`,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.2,
        },

        ratingIconBox: {
            width: 38,
            height: 38,
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.dark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.85rem",
            flexShrink: 0,
            border: `1px solid ${theme.palette.primary.main}`,
        },

        ratingContent: {
            display: "flex",
            flexDirection: "column",
            gap: 0.3,
            minWidth: 0,
        },

        ratingTitleRow: {
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            flexWrap: "wrap",
        },

        ratingTitle: {
            fontWeight: 800,
            color: theme.palette.text.primary,
            fontSize: "0.9rem",
        },

        ratingCommentText: {
            color: theme.palette.text.secondary,
            lineHeight: 1.5,
            fontSize: "0.86rem",
        },

        ratingDateText: {
            color: theme.palette.text.secondary,
            fontSize: "0.76rem",
        },
    };

    return (
        <Box sx={style.ratingBanner}>
            <Box sx={style.ratingIconBox}>
                {rating.toFixed(1)}
            </Box>

            <Box sx={style.ratingContent}>
                <Box sx={style.ratingTitleRow}>
                    <Typography sx={style.ratingTitle}>
                        Calificación del usuario
                    </Typography>

                    <Rating
                        value={rating}
                        readOnly
                        size="small"
                    />
                </Box>

                <Typography sx={style.ratingCommentText}>
                    {ratingComment
                        ? `${ratingComment}`
                        : "N/A"}
                </Typography>

                {ratedAt && (
                    <Typography sx={style.ratingDateText}>
                        Calificada el {formatDate(ratedAt)}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default PqrRatingSummary;