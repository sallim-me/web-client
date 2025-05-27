import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  useTheme,
  Paper,
  Pagination,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostCard from "../../../components/PostCard";

// 임시 데이터 타입 정의
interface Post {
  id: number;
  title: string;
  modelName: string;
  isScraped: boolean;
  category: string;
  description: string;
  author: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  isAuthor: boolean;
  tradeType: "sell" | "buy";
  modelNumber: string;
  brand: string;
  minPrice: number;
  quantity: number;
  defectAnswers: Record<string, string>;
  createdAt: string;
  status: "available" | "sold";
  images: string[];
}

interface StatusOption {
  value: "all" | "available" | "sold";
  label: string;
}

const PostList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "available" | "sold"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const categories = ["냉장고", "에어컨", "세탁기"];
  const statusOptions: StatusOption[] = [
    { value: "all", label: "전체 상태" },
    { value: "available", label: "판매중" },
    { value: "sold", label: "판매완료" },
  ];

  // 초기 게시물 데이터
  const initialPosts: Post[] = [
    {
      id: 1,
      title: "[판매] 삼성 냉장고 팝니다",
      tradeType: "sell",
      category: "refrigerator",
      modelName: "RM70F90",
      modelNumber: "",
      brand: "삼성",
      minPrice: 500000,
      description: "1년 사용한 냉장고입니다. 상태 매우 좋습니다.",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/refrigerator.svg`],
      isScraped: false,
      author: {
        id: 1,
        nickname: "판매자1",
        profileImage: "",
      },
      isAuthor: true,
      defectAnswers: {
        "냉각 기능에 문제가 있나요?": "정상입니다.",
        "문이 제대로 닫히나요?": "네.",
        "내부 부품이 모두 있나요?": "네, 다 있습니다.",
      },
      createdAt: new Date().toISOString(),
      status: "available",
    },
    {
      id: 2,
      title: "[판매] LG 통돌이 세탁기 급처",
      tradeType: "sell",
      category: "washer",
      modelName: "CAE7895SI",
      modelNumber: "",
      brand: "LG",
      minPrice: 150000,
      description: "",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/washer.svg`],
      isScraped: true,
      author: {
        id: 1,
        nickname: "판매자1",
        profileImage: "",
      },
      isAuthor: true,
      defectAnswers: {
        "세탁 기능에 문제가 있나요?": "정상 작동합니다.",
        "배수가 잘 되나요?": "네, 잘 됩니다.",
        "소음이 심한가요?": "조금 있습니다.",
      },
      createdAt: new Date().toISOString(),
      status: "sold",
    },
    {
      id: 3,
      title: "[판매] 스탠드 에어컨 판매합니다",
      tradeType: "sell",
      category: "aircon",
      modelName: "E5ZSC",
      modelNumber: "",
      brand: "",
      minPrice: 350000,
      description: "",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/airconditioner.svg`],
      isScraped: false,
      author: {
        id: 2,
        nickname: "판매자2",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {
        "냉방 기능에 문제가 있나요?": "정상입니다.",
        "실외기 상태는 어떤가요?": "깨끗합니다.",
        "필터 상태는 어떤가요?": "최근 교체했습니다.",
      },
      createdAt: new Date().toISOString(),
      status: "available",
    },
    {
      id: 4,
      title: "[판매] 건조기 팔아요 (2년 사용)",
      tradeType: "sell",
      category: "washer",
      modelName: "333CDO23",
      modelNumber: "",
      brand: "",
      minPrice: 400000,
      description: "",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/washer.svg`],
      isScraped: true,
      author: {
        id: 3,
        nickname: "판매자3",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
      status: "sold",
    },
    {
      id: 5,
      title: "[구매] 삼성 비스포크 냉장고 구매",
      tradeType: "buy",
      category: "refrigerator",
      modelName: "",
      modelNumber: "",
      brand: "삼성",
      minPrice: 0,
      description: "중고 냉장고 구매 원합니다. 상태 좋은 것만 구매합니다.",
      quantity: 1,
      images: [],
      isScraped: false,
      author: {
        id: 4,
        nickname: "구매자1",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
      status: "available",
    },
    {
      id: 6,
      title: "[구매] 벽걸이 에어컨 구매",
      tradeType: "buy",
      category: "aircon",
      modelName: "",
      modelNumber: "",
      brand: "",
      minPrice: 0,
      description: "",
      quantity: 1,
      images: [],
      isScraped: false,
      author: {
        id: 5,
        nickname: "구매자2",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
      status: "available",
    },
    {
      id: 7,
      title: "[구매] LG 트롬 세탁기 구매",
      tradeType: "buy",
      category: "washer",
      modelName: "",
      modelNumber: "",
      brand: "LG",
      minPrice: 0,
      description: "",
      quantity: 1,
      images: [],
      isScraped: true,
      author: {
        id: 6,
        nickname: "구매자3",
        profileImage: "",
      },
      isAuthor: false,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
      status: "sold",
    },
    {
      id: 8,
      title: "[판매] 삼성 냉장고 (새제품)",
      tradeType: "sell",
      category: "refrigerator",
      modelName: "OWJ70002",
      modelNumber: "",
      brand: "삼성",
      minPrice: 650000,
      description: "나온지 얼마 안된 모델입니다.",
      quantity: 1,
      images: [`${process.env.PUBLIC_URL}/images/refrigerator.svg`],
      isScraped: false,
      author: {
        id: 7,
        nickname: "판매자4",
        profileImage: "",
      },
      isAuthor: true,
      defectAnswers: {},
      createdAt: new Date().toISOString(),
      status: "available",
    },
  ];

  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem("posts");
    const parsedPosts = savedPosts ? JSON.parse(savedPosts) : initialPosts;

    return parsedPosts.map((post: Post) => ({
      ...post,
      author: post.author || "현재 사용자",
      isAuthor: post.isAuthor ?? true,
      status: post.status || "available",
    }));
  });

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleScrap = (postId: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, isScraped: !post.isScraped } : post
    );
    setPosts(updatedPosts);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(post.category);
    const statusMatch =
      selectedStatus === "all" || post.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ pb: "76px" }}>
      <Container maxWidth="sm" sx={{ px: 1.5, py: 1.5 }}>
        <Stack spacing={1.5}>
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
              게시글 목록
            </Typography>
          </Paper>

          {/* 카테고리 필터 */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategories.includes(category)
                    ? "contained"
                    : "outlined"
                }
                size="small"
                onClick={() => toggleCategory(category)}
                sx={{
                  borderRadius: "16px",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 1.5,
                  py: 0.75,
                  fontSize: "13px",
                  borderColor: "primary.main",
                  color: selectedCategories.includes(category)
                    ? "white"
                    : "primary.main",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: selectedCategories.includes(category)
                      ? "white"
                      : "primary.main",
                  },
                }}
              >
                {category}
              </Button>
            ))}
          </Box>

          <Divider />

          {/* 상태 필터 */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={
                  selectedStatus === option.value ? "contained" : "outlined"
                }
                size="small"
                onClick={() => setSelectedStatus(option.value)}
                sx={{
                  borderRadius: "16px",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 1.5,
                  py: 0.75,
                  fontSize: "13px",
                  borderColor: "primary.main",
                  color:
                    selectedStatus === option.value ? "white" : "primary.main",
                  "&:hover": {
                    borderColor: "primary.main",
                    color:
                      selectedStatus === option.value
                        ? "white"
                        : "primary.main",
                  },
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>

          {/* 게시물 목록 */}
          <Grid container spacing={2}>
            {currentPosts.map((post) => (
              <Grid item xs={6} key={post.id}>
                <PostCard
                  id={post.id}
                  title={post.title}
                  modelName={post.modelName || ""}
                  minPrice={post.minPrice}
                  images={post.images}
                  isScraped={post.isScraped}
                  onScrapClick={() => handleScrap(post.id)}
                  onClick={() => navigate(`/post/detail/${post.id}`)}
                />
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "1rem",
                  },
                }}
              />
            </Box>
          )}

          {/* 글쓰기 버튼 */}
          <IconButton
            onClick={() => navigate("/post/create")}
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              bgcolor: "primary.main",
              color: "white",
              width: 56,
              height: 56,
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
};

export default PostList;
