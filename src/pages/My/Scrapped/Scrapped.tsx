import React, { useState, useEffect, useCallback } from "react";
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
import PostCard from "@/components/PostCard";
import { scrapApi, Scrap } from "@/api/scrap";

const Scrapped = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 10;

  const fetchScraps = useCallback(async () => {
    try {
      setLoading(true);
      const response = await scrapApi.getScraps({
        page: currentPage - 1,
        size: postsPerPage,
      });
      console.log("Scraps response:", response);
      setScraps(response.scraps);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch scraps:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, postsPerPage]);

  useEffect(() => {
    fetchScraps();
  }, [fetchScraps]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleBack = () => {
    navigate("/my-page");
  };

  const handleScrapClick = async (productId: number) => {
    try {
      await scrapApi.deleteScrapByProductId(productId);
      // 스크랩 취소 후 목록 새로고침
      await fetchScraps();
    } catch (error: any) {
      console.error("Failed to delete scrap:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        alert("스크랩 삭제 중 오류가 발생했습니다.");
      }
    }
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : scraps.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography color="text.secondary">
            스크랩한 글이 없습니다.
          </Typography>
        </Box>
      ) : (
        <>
          {/* 게시글 그리드 */}
          <Grid container spacing={2} sx={{ px: 2 }}>
            {scraps.map((scrap) => {
              console.log("Scrap item data:", {
                id: scrap.productId,
                scrapId: scrap.id,
                postType: scrap.postType,
                title: scrap.title,
                modelName: scrap.modelName,
                price: scrap.price,
                isActive: scrap.isActive,
                images: scrap.images,
              });
              return (
                <Grid item xs={6} key={scrap.productId}>
                  <PostCard
                    key={scrap.productId}
                    id={scrap.productId}
                    scrapId={scrap.id}
                    title={scrap.title}
                    modelName={scrap.modelName}
                    price={scrap.price}
                    quantity={null} // 스크랩에는 수량 정보가 없으므로 null로 설정
                    thumbnailUrl={scrap.images[0] || ""}
                    isScraped={true}
                    onScrapClick={() => handleScrapClick(scrap.productId)}
                    postType={
                      scrap.postType.toLowerCase() as "buying" | "selling"
                    }
                    isActive={scrap.isActive}
                    createdAt={scrap.createdAt}
                  />
                </Grid>
              );
            })}
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

export default Scrapped;
