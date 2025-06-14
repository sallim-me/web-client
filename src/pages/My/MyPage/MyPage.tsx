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
  Skeleton,
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

  const [profileDisplayColor, setProfileDisplayColor] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  useEffect(() => {
    if (userProfile?.profileColor) {
      setProfileDisplayColor(userProfile.profileColor);
    } else if (profileDisplayColor === undefined) {
      setProfileDisplayColor(getRandomColor());
    }
  }, [userProfile, profileDisplayColor]);

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

  const handleScrapClick = (scrapId: number) => {
    // Implement the logic to handle the scrap click
    console.log("Scrap clicked:", scrapId);
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
              bgcolor: profileDisplayColor,
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
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              overflowX: "auto",
              pb: 1,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <Paper
                key={index}
                sx={{
                  flexShrink: 0,
                  width: 140,
                }}
              >
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={70}
                  sx={{ borderRadius: "8px 8px 0 0" }}
                />
                <Box sx={{ p: 1 }}>
                  <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={16} />
                </Box>
              </Paper>
            ))}
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
                    // src={`${process.env.PUBLIC_URL}/images/${
                    //   post.postType === "BUYING" ? "buy" : "sell"
                    // }.svg`}
                    src={post.thumbnailUrl || "/public/images/refrigerator.svg"}
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
          <IconButton onClick={() => navigate("/my-page/scraps")} size="small">
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        {scrapLoading ? (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              overflowX: "auto",
              pb: 1,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <Paper
                key={index}
                sx={{
                  flexShrink: 0,
                  width: 140,
                }}
              >
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={70}
                  sx={{ borderRadius: "8px 8px 0 0" }}
                />
                <Box sx={{ p: 1 }}>
                  <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="70%" height={16} />
                </Box>
              </Paper>
            ))}
          </Box>
        ) : scraps.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            스크랩한 글이 없습니다.
          </Typography>
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
            {scraps.slice(0, 5).map((scrap) => {
              console.log("Scrap item postType:", scrap.postType);
              return (
                <Paper
                  key={scrap.id}
                  onClick={() =>
                    navigate(
                      `/post/detail/${scrap.productId}?type=${
                        typeof scrap.postType === "string"
                          ? scrap.postType.toLowerCase()
                          : "selling"
                      }`
                    )
                  }
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
                    {scrap.thumbnailUrl ? (
                      <img
                        src={scrap.thumbnailUrl}
                        alt={scrap.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          bgcolor: "grey.300",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          이미지 없음
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                      {scrap.productTitle}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₩{(scrap.price ?? 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MyPage;
