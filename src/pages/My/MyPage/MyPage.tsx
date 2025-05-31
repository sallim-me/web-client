import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuthStore } from "@/store/useAuthStore";
import { memberApi, MyPost } from "@/api/member";
import { scrapApi, Scrap } from "@/api/scrap";

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
  const userProfile = useAuthStore((state) => state.userProfile);
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrapLoading, setScrapLoading] = useState(true);

  const nickname = userProfile?.nickname || "N/A";
  const userName = userProfile?.name || "N/A";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, scrapsResponse] = await Promise.all([
          memberApi.getMyPosts(),
          scrapApi.getScraps({ size: 5 }),
        ]);
        setMyPosts(postsResponse.data);
        setScraps(scrapsResponse.scraps);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
        setScrapLoading(false);
      }
    };

    fetchData();
  }, []);

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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
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
            {myPosts.slice(0, 5).map((post) => (
              <Paper
                key={post.productId}
                onClick={() => navigate(`/post/detail/${post.productId}`)}
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
                    src={`${process.env.PUBLIC_URL}/images/${
                      post.postType === "BUYING" ? "buy" : "sell"
                    }.svg`}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box sx={{ p: 1 }}>
                  <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={post.isActive ? "primary" : "text.secondary"}
                    fontWeight="bold"
                  >
                    {post.postType === "SELLING" ? "판매" : "구매"}
                    {!post.isActive && " (비활성)"}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
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
        {scrapLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : scraps.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography color="text.secondary">
              스크랩한 글이 없습니다.
            </Typography>
          </Box>
        ) : (
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
            {scraps.map((scrap) => (
              <Paper
                key={scrap.id}
                onClick={() => navigate(`/post/detail/${scrap.productId}`)}
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
                      scrap.images && scrap.images.length > 0
                        ? scrap.images[0]
                        : `${process.env.PUBLIC_URL}/images/${
                            scrap.postType === "BUYING" ? "buy" : "sell"
                          }.svg`
                    }
                    alt={scrap.productTitle}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box sx={{ p: 1 }}>
                  <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                    {scrap.productTitle}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography
                      variant="caption"
                      color={scrap.isActive ? "primary" : "text.secondary"}
                    >
                      {scrap.postType === "SELLING" ? "판매" : "구매"}
                    </Typography>
                    {!scrap.isActive && (
                      <Typography variant="caption" color="text.secondary">
                        (비활성)
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MyPage;
