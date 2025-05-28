import React from "react";
import { Box, Paper, Typography, IconButton, Stack } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { getImageUrl } from "../utils/image";

interface PostCardProps {
  id: number;
  title: string;
  modelName: string;
  minPrice: number;
  images?: string[];
  isScraped: boolean;
  onScrapClick: () => void;
  onClick: () => void;
  specifications?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  modelName,
  minPrice,
  images,
  isScraped,
  onScrapClick,
  onClick,
}) => {
  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onScrapClick();
  };

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2,
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 120,
          overflow: "hidden",
          borderRadius: 1,
          bgcolor: "grey.200",
        }}
      >
        <img
          src={getImageUrl(images?.[0] ?? "")}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getImageUrl(null);
          }}
        />
      </Box>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          wordBreak: "break-all",
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          wordBreak: "break-all",
        }}
      >
        {modelName}
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: "auto" }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          ₩{(minPrice ?? 0).toLocaleString()}
        </Typography>

        <IconButton
          onClick={handleScrapClick}
          size="small"
          sx={{
            p: 0.5,
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          {isScraped ? (
            <BookmarkIcon color="primary" />
          ) : (
            <BookmarkBorderIcon />
          )}
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default PostCard;
