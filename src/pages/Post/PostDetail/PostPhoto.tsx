import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Skeleton,
  Alert,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateRightIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from "@mui/icons-material";
import { getProductPhotos, Photo } from "@/api/photo";

interface PostPhotoProps {
  productId: number;
}

export const PostPhoto: React.FC<PostPhotoProps> = ({ productId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const photoData = await getProductPhotos(productId);
        setPhotos(photoData);
      } catch (err) {
        setError("사진을 불러오는데 실패했습니다.");
        console.error("Failed to fetch photos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId && productId > 0) {
      fetchPhotos();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setZoom(1);
    setRotation(0);
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
    setZoom(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleNextPhoto = () => {
    if (
      selectedPhotoIndex !== null &&
      photos &&
      photos.length > 0 &&
      selectedPhotoIndex < photos.length - 1
    ) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
      setZoom(1);
      setRotation(0);
    }
  };

  // Return null if productId is invalid
  if (!productId || productId <= 0) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          상품 사진
        </Typography>
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={120}
              height={120}
              sx={{ borderRadius: 1, flexShrink: 0 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          상품 사진
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (photos?.length === 0) {
    return (
      <></>
      // <Box sx={{ width: '100%', mb: 2 }}>
      //   <Typography variant="h6" gutterBottom>
      //     상품 사진
      //   </Typography>
      //   <Alert severity="info">등록된 사진이 없습니다.</Alert>
      // </Box>
    );
  }

  return !photos?.length ? (
    <></>
  ) : (
    <Box sx={{ width: "100%" }}>
      {/* Photo Thumbnails with Horizontal Scroll */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 3,
          },
        }}
      >
        {(photos || []).map((photo, index) => (
          <Card
            key={photo.id}
            sx={{
              minWidth: 120,
              height: 120,
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: theme.shadows[4],
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
            onClick={() => handlePhotoClick(index)}
          >
            <CardMedia
              component="img"
              height="120"
              image={photo.fileUrl}
              alt={`상품 사진 ${index + 1}`}
              sx={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </Card>
        ))}
      </Box>

      {/* Full Screen Photo Modal */}
      <Dialog
        open={selectedPhotoIndex !== null}
        onClose={handleCloseModal}
        maxWidth={false}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            backgroundColor: "black",
            color: "white",
            margin: isMobile ? 0 : 2,
            borderRadius: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogContent
          sx={{
            padding: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isMobile ? "100vh" : "80vh",
            overflow: "hidden",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Photo Counter */}
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "4px 8px",
              borderRadius: 1,
            }}
          >
            {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 0} /{" "}
            {photos?.length || 0}
          </Typography>

          {/* Navigation Buttons */}
          {selectedPhotoIndex !== null && selectedPhotoIndex > 0 && (
            <IconButton
              onClick={handlePrevPhoto}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {selectedPhotoIndex !== null &&
            photos &&
            photos.length > 0 &&
            selectedPhotoIndex < photos.length - 1 && (
              <IconButton
                onClick={handleNextPhoto}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            )}

          {/* Main Photo */}
          {selectedPhotoIndex !== null && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: zoom > 1 ? "grab" : "zoom-in",
                "&:active": {
                  cursor: zoom > 1 ? "grabbing" : "zoom-in",
                },
              }}
              onClick={(e) => {
                if (e.detail === 2) {
                  // Double click
                  setZoom(zoom === 1 ? 2 : 1);
                }
              }}
            >
              <img
                src={
                  photos &&
                  selectedPhotoIndex !== null &&
                  photos[selectedPhotoIndex]
                    ? photos[selectedPhotoIndex].fileUrl
                    : ""
                }
                alt={`상품 사진 ${
                  selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 0
                }`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </Box>
          )}

          {/* Control Buttons */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              zIndex: 10,
            }}
          >
            <Fab
              size="small"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              <ZoomOutIcon />
            </Fab>

            <Fab
              size="small"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              <ZoomInIcon />
            </Fab>

            <Fab
              size="small"
              onClick={handleRotate}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <RotateRightIcon />
            </Fab>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PostPhoto;
