import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Grid,
  Pagination,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostCard from "../../../components/PostCard";

// 타입 정의
interface Post {
  id: number;
  title: string;
  minPrice: number;
  imageUrl: string;
  isAuthor: boolean;
  isScraped: boolean;
  modelName: string;
  category: string;
  status: "available" | "sold";
  author?: string;
  authorId?: string;
  type?: "sell" | "buy";
  specifications: string;
  defectAnswers?: {
    cooling: string;
    noise: string;
    exterior: string;
  };
  description: string;
}

const ScrappedPosts = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // 실제 글 데이터 불러오기
  const savedPosts = localStorage.getItem("posts");
  const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

  const formatSpecifications = (specs: any) => {
    if (typeof specs === "string") return specs;
    if (typeof specs === "object" && specs !== null) {
      return Object.entries(specs)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }
    return "";
  };

  const scrappedPosts = posts
    .filter((post) => post.isScraped)
    .map((post) => ({
      ...post,
      specifications: formatSpecifications(post.specifications),
    }));

  const handleScrap = (postId: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, isScraped: !post.isScraped } : post
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    // Force re-render
    window.location.reload();
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(scrappedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = scrappedPosts.slice(startIndex, endIndex);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleBack = () => {
    navigate("/my-page");
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
            스크랩한 글
          </Typography>
        </Stack>
      </Paper>

      {/* 게시글 그리드 */}
      <Grid container spacing={2} sx={{ px: 2 }}>
        {currentPosts.map((post) => (
          <Grid item xs={6} key={post.id}>
            <PostCard
              id={post.id}
              title={post.title}
              modelName={post.modelName || ""}
              minPrice={post.minPrice}
              images={[post.imageUrl]}
              isScraped={post.isScraped}
              onScrapClick={() => handleScrap(post.id)}
              onClick={() => navigate(`/post/detail/${post.id}`)}
            />
          </Grid>
        ))}
      </Grid>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ScrappedPosts;
