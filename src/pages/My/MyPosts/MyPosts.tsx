import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Stack,
  Pagination,
  Grid,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostCard from "../../../components/PostCard";
import { memberApi, MyPost } from "@/api/member";

const MyPosts = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await memberApi.getMyPosts();
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

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
            내가 쓴 글
          </Typography>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 게시글 그리드 */}
          <Grid container spacing={2} sx={{ px: 2 }}>
            {currentPosts.map((post) => (
              <Grid item xs={6} key={post.productId}>
                <PostCard
                  key={post.productId}
                  id={post.productId}
                  title={post.title}
                  modelName={post.modelName}
                  price={post.price}
                  quantity={null}
                  thumbnailUrl={""}
                  isScraped={false}
                  onScrapClick={() => {}}
                  postType={post.postType.toLowerCase() as "buying" | "selling"}
                  isActive={post.isActive}
                  createdAt={post.createdAt}
                />
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default MyPosts;
