import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuthStore } from "@/store/useAuthStore";

// 타입 정의
interface Post {
  id: number;
  title: string;
  tradeType: "sell" | "buy";
  category: string;
  modelNumber: string;
  modelName: string;
  brand: string;
  minPrice: number;
  description: string;
  quantity: number;
  images: string[];
  isScraped: boolean;
  author: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  isAuthor: boolean;
  defectAnswers: Record<string, string>;
  createdAt: string;
}

const MyPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // 예시 유저 정보
  const nickname = "HGD";
  const userName = "홍길동";

  // 실제 글 데이터 불러오기
  const savedPosts = localStorage.getItem("posts");
  const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
  const myPosts = posts.filter((post) => post.isAuthor);
  const scrappedPosts = posts.filter((post) => post.isScraped);

  const getRandomColor = () => {
    const colors = [
      "#FF9AA2",
      "#FFB7B2",
      "#FFDAC1",
      "#E2F0CB",
      "#B5EAD7",
      "#C7CEEA",
      "#9FB3DF",
      "#B8B3E9",
      "#D4A5A5",
      "#9CADCE",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Container maxWidth="sm" sx={{ pb: "76px" }}>
      {/* 헤더 */}
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          p: 2,
          mb: 2,
          borderRadius: 0,
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
        elevation={0}
      >
        <Typography variant="h6" align="center">
          마이페이지
        </Typography>
      </Paper>

      {/* 프로필 섹션 */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: getRandomColor(),
              fontSize: 24,
            }}
          >
            {nickname.charAt(0)}
          </Avatar>
          <Stack spacing={0.5}>
            <Typography variant="h6">{userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              닉네임: {nickname}
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="outlined"
          sx={{ width: "60%", mx: "auto" }}
          onClick={() => navigate("/my-page/edit-profile")}
        >
          회원 정보 수정
        </Button>
      </Paper>

      {/* 내가 쓴 글 */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            내가 쓴 글
          </Typography>
          <IconButton
            onClick={() => navigate("/my-page/my-posts")}
            size="small"
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              height: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 2,
            },
          }}
        >
          {myPosts.map((post) => (
            <Paper
              key={post.id}
              onClick={() => navigate(`/post/detail/${post.id}`)}
              sx={{
                flexShrink: 0,
                width: 140,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Box
                sx={{
                  height: 70,
                  bgcolor: "grey.200",
                  borderRadius: "8px 8px 0 0",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    post.images && post.images.length > 0
                      ? post.images[0]
                      : post.tradeType === "buy" // 구매 글인 경우
                      ? post.category === "refrigerator" // 카테고리에 따라 다른 이미지
                        ? `${process.env.PUBLIC_URL}/images/refrigerator.svg`
                        : post.category === "washer"
                        ? `${process.env.PUBLIC_URL}/images/washer.svg`
                        : post.category === "aircon"
                        ? `${process.env.PUBLIC_URL}/images/airconditioner.svg`
                        : `${process.env.PUBLIC_URL}/images/placeholder.svg` // 정의되지 않은 카테고리 또는 이미지 없는 판매 글
                      : `${process.env.PUBLIC_URL}/images/placeholder.svg` // 이미지 없는 판매 글
                  }
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `${process.env.PUBLIC_URL}/images/placeholder.svg`;
                  }}
                />
              </Box>
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                  {post.title}
                </Typography>
                {post.tradeType === "sell" &&
                  typeof post.minPrice === "number" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="bold"
                    >
                      ₩{post.minPrice.toLocaleString()}
                    </Typography>
                  )}
                {post.tradeType === "buy" &&
                  typeof post.quantity === "number" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="bold"
                    >
                      수량: {post.quantity}개
                    </Typography>
                  )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* 스크랩한 글 */}
      <Box sx={{ px: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            스크랩한 글
          </Typography>
          <IconButton
            onClick={() => navigate("/my-page/scrapped")}
            size="small"
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              height: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 2,
            },
          }}
        >
          {scrappedPosts.map((post) => (
            <Paper
              key={post.id}
              onClick={() => navigate(`/post/detail/${post.id}`)}
              sx={{
                flexShrink: 0,
                width: 140,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Box
                sx={{
                  height: 70,
                  bgcolor: "grey.200",
                  borderRadius: "8px 8px 0 0",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    post.images && post.images.length > 0
                      ? post.images[0]
                      : post.tradeType === "buy" // 구매 글인 경우
                      ? post.category === "refrigerator" // 카테고리에 따라 다른 이미지
                        ? `${process.env.PUBLIC_URL}/images/refrigerator.svg`
                        : post.category === "washer"
                        ? `${process.env.PUBLIC_URL}/images/washer.svg`
                        : post.category === "aircon"
                        ? `${process.env.PUBLIC_URL}/images/airconditioner.svg`
                        : `${process.env.PUBLIC_URL}/images/placeholder.svg` // 정의되지 않은 카테고리 또는 이미지 없는 판매 글
                      : `${process.env.PUBLIC_URL}/images/placeholder.svg` // 이미지 없는 판매 글
                  }
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `${process.env.PUBLIC_URL}/images/placeholder.svg`;
                  }}
                />
              </Box>
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                  {post.title}
                </Typography>
                {post.tradeType === "sell" &&
                  typeof post.minPrice === "number" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="bold"
                    >
                      ₩{post.minPrice.toLocaleString()}
                    </Typography>
                  )}
                {post.tradeType === "buy" &&
                  typeof post.quantity === "number" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="bold"
                    >
                      수량: {post.quantity}개
                    </Typography>
                  )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default MyPage;
