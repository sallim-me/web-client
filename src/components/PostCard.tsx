import React from "react";
import { Box, Paper, Typography, IconButton, Stack, Chip } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ImageIcon from "@mui/icons-material/Image";
import { getImageUrl } from "../utils/image";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  id: number;
  scrapId?: number;
  title: string;
  modelName: string;
  minPrice: number;
  thumbnailUrl?: string;
  isScraped: boolean;
  onScrapClick: () => void;
  postType: "buying" | "selling";
  isActive?: boolean;
  createdAt?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  scrapId,
  title,
  modelName,
  minPrice,
  thumbnailUrl,
  isScraped,
  onScrapClick,
  postType,
  isActive,
  createdAt,
}) => {
  const navigate = useNavigate();

  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onScrapClick();
  };

  const handleClick = () => {
    navigate(`/post/detail/${id}?type=${postType}`);
  };

  const imageUrl = thumbnailUrl ? thumbnailUrl : null;

  return (
    <Paper
      onClick={handleClick}
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
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
        ) : (
          <ImageIcon sx={{ fontSize: 60, color: "grey.400" }} />
        )}
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
            <BookmarkIcon color="primary" sx={{ fontSize: 24 }} />
          ) : (
            <BookmarkBorderIcon sx={{ fontSize: 24 }} />
          )}
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default PostCard;
