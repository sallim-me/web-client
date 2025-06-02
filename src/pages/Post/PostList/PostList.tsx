import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Paper,
  Pagination,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PostCard from "../../../components/PostCard";
import { getAllProducts, Product } from "../../../api/product";
import { scrapApi } from "../../../api/scrap";
import { Scrap } from "../../../api/scrap";

const PostList = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 10;

  const categories = ["냉장고", "에어컨", "세탁기"];
  const categoryMapping: Record<string, string> = {
    냉장고: "REFRIGERATOR",
    에어컨: "AIR_CONDITIONER",
    세탁기: "WASHING_MACHINE",
  };

  const fetchProductsAndScraps = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching products and scraps...");

      const [productResponse, scrapResponse] = await Promise.all([
        getAllProducts(),
        scrapApi.getScraps({ size: 1000 }),
      ]);

      console.log("Product response:", productResponse);
      console.log("Scrap response:", scrapResponse);

      // Create a map of product IDs to scrap information
      const scrapMap = new Map<number, Scrap>();
      scrapResponse.scraps.forEach((scrap) => {
        if (scrap.productId) {
          scrapMap.set(scrap.productId, scrap);
        }
      });

      console.log("Scrap map:", Object.fromEntries(scrapMap));

      // Map products with scrap information
      const productsWithScrapInfo = productResponse.data.map((product) => {
        const scrapInfo = scrapMap.get(product.id);
        return {
          ...product,
          isScraped: !!scrapInfo,
          scrapId: scrapInfo?.id,
        };
      });

      console.log("Products with scrap info:", productsWithScrapInfo);
      setProducts(productsWithScrapInfo);
      setError(null);
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
      setError("상품 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsAndScraps();
  }, [fetchProductsAndScraps]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some(
        (cat) => product.category === categoryMapping[cat]
      );

    return categoryMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrapClick = async (
    productId: number,
    isScraped: boolean,
    scrapId?: number
  ) => {
    try {
      if (isScraped && scrapId) {
        await scrapApi.removeScrap(scrapId);
        // 스크랩 취소 시 해당 상품의 상태만 업데이트
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, isScraped: false, scrapId: undefined }
              : product
          )
        );
      } else {
        const newScrap = await scrapApi.addScrap({ productId });
        // 스크랩 추가 시 해당 상품의 상태만 업데이트
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, isScraped: true, scrapId: newScrap.id }
              : product
          )
        );
      }
    } catch (error) {
      console.error("스크랩 처리 중 오류 발생:", error);
      // TODO: 에러 메시지 표시
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

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

          {/* 게시물 목록 */}
          <Grid container spacing={2}>
            {currentProducts.map((product) => (
              <Grid item xs={6} key={product.id}>
                <PostCard
                  id={product.id}
                  title={product.title}
                  modelName={product.modelName}
                  minPrice={0}
                  images={[]}
                  isScraped={product.isScraped}
                  onScrapClick={() =>
                    handleScrapClick(
                      product.id,
                      product.isScraped,
                      product.scrapId
                    )
                  }
                  onClick={() => navigate(`/post/detail/${product.id}`)}
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
