import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ImageIcon from "@mui/icons-material/Image";
import { getImageUrl, DefaultImageType } from "../utils/image";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  id: number;
  scrapId?: number;
  title: string;
  modelName: string | null;
  price: number | null;
  quantity: number | null;
  thumbnailUrl?: string | null;
  isScraped: boolean;
  onScrapClick: () => void;
  postType: "buying" | "selling";
  isActive?: boolean;
  createdAt?: string;
  applianceType?: string;
  category?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  scrapId,
  title,
  modelName,
  price,
  quantity,
  thumbnailUrl,
  isScraped,
  onScrapClick,
  postType,
  isActive,
  createdAt,
  applianceType,
  category,
}) => {
  const navigate = useNavigate();

  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onScrapClick();
  };

  const handleClick = () => {
    navigate(`/post/detail/${id}?type=${postType}`);
  };

  let finalImageUrl: string | undefined;

  if (thumbnailUrl) {
    finalImageUrl = thumbnailUrl;
  } else {
    let imageTypeForUrl: DefaultImageType | undefined;
    const typeIdentifier = applianceType || category;

    if (typeIdentifier) {
      switch (typeIdentifier.toUpperCase()) {
        case "TV":
          imageTypeForUrl = "AIRCONDITIONER";
          break;
        case "REFRIGERATOR":
          imageTypeForUrl = "REFRIGERATOR";
          break;
        case "WASHER":
        case "WASHING_MACHINE":
          imageTypeForUrl = "WASHER";
          break;
        case "AIR_CONDITIONER":
          imageTypeForUrl = "AIRCONDITIONER";
          break;
        default:
          imageTypeForUrl = undefined;
          break;
      }
    }

    if (imageTypeForUrl) {
      finalImageUrl = getImageUrl(null, imageTypeForUrl);
    } else {
      finalImageUrl = getImageUrl(null);
    }
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        p: 2,
        cursor: "pointer",
        height: "100%",
        width: "100%",
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
        {finalImageUrl ? (
          <img
            src={finalImageUrl}
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
        {modelName || "모델명 정보 없음"}
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
          {postType === "buying"
            ? `수량: ${(quantity ?? 0).toLocaleString()}`
            : `₩${price?.toLocaleString() ?? ""}`}
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
    </Box>
  );
};

export default PostCard;
