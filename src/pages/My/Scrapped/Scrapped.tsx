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
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={handleBack}
            size="small"
            sx={{ position: "absolute", left: 0 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">스크랩한 글</Typography>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : scraps.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <Typography color="text.secondary">
            스크랩한 글이 없습니다.
          </Typography>
        </Box>
      ) : (
        <>
          {/* 게시글 그리드 */}
          <Grid
            container
            spacing={2}
            justifyContent="flex-start"
            sx={{ px: 2 }}
          >
            {scraps.map((scrap) => {
              console.log("Scrap item data:", {
                id: scrap.productId,
                scrapId: scrap.id,
                postType: scrap.postType,
                title: scrap.productTitle,
                modelName: scrap.memberNickname,
                price: scrap.productPrice,
                createdAt: scrap.createdAt,
              });
              return (
                <Grid item xs={6} sm={6} key={scrap.productId}>
                  <PostCard
                    key={scrap.productId}
                    id={scrap.productId}
                    scrapId={scrap.id}
                    title={scrap.productTitle}
                    modelName={scrap.memberNickname}
                    price={scrap.productPrice || 0}
                    thumbnailUrl={
                      scrap.thumbnailUrl ||
                      `${process.env.PUBLIC_URL}/images/${
                        scrap.postType === "BUYING" ? "buy" : "sell"
                      }.svg`
                    }
                    quantity={null}
                    isScraped={true}
                    onScrapClick={() => handleScrapClick(scrap.productId)}
                    postType={
                      scrap.postType.toLowerCase() as "buying" | "selling"
                    }
                    isActive={true}
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
