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
  Paper,
  Pagination,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PostCard from "../../../components/PostCard";
import { getAllProducts, Product } from "../../../api/product";
import { scrapApi } from "../../../api/scrap";

const PostList = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
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

  const statuses = ["판매중", "판매완료", "구매중", "구매완료"];
  const statusMapping: Record<
    string,
    { type: "SELLING" | "BUYING"; isActive: boolean }
  > = {
    판매중: { type: "SELLING", isActive: true },
    판매완료: { type: "SELLING", isActive: false },
    구매중: { type: "BUYING", isActive: true },
    구매완료: { type: "BUYING", isActive: false },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        console.log("Fetched products:", response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("상품 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some(
        (cat) => product.category === categoryMapping[cat]
      );

    const statusMatch =
      selectedStatuses.length === 0 ||
      selectedStatuses.some((status) => {
        const { type, isActive } = statusMapping[status];
        console.log(`Checking product ${product.id}:`, {
          productTradeType: product.tradeType,
          productIsActive: product.isActive,
          filterType: type,
          filterIsActive: isActive,
        });
        return product.tradeType === type && product.isActive === isActive;
      });

    return categoryMatch && statusMatch;
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

  const handleScrapClick = async (productId: number) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (product.isScraped) {
        await scrapApi.deleteScrap(productId);
      } else {
        await scrapApi.createScrap({ productId });
      }

      // Update the product's scrap status in the local state
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, isScraped: !p.isScraped } : p
        )
      );
    } catch (error) {
      console.error("Failed to toggle scrap:", error);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ pb: "76px" }}>
      <Container maxWidth="sm" sx={{ px: 0, py: 1.5 }}>
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

          {/* 거래 상태 필터 */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={
                  selectedStatuses.includes(status) ? "contained" : "outlined"
                }
                size="small"
                onClick={() => toggleStatus(status)}
                sx={{
                  borderRadius: "16px",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 1.5,
                  py: 0.75,
                  fontSize: "13px",
                  borderColor: "primary.main",
                  color: selectedStatuses.includes(status)
                    ? "white"
                    : "primary.main",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: selectedStatuses.includes(status)
                      ? "white"
                      : "primary.main",
                  },
                }}
              >
                {status}
              </Button>
            ))}
          </Box>

          <Divider />

          {/* 게시물 목록 */}
          <Grid container spacing={2} justifyContent="center" sx={{ px: 1 }}>
            {currentProducts.map((product) => (
              <Grid item xs={6} key={product.id}>
                <PostCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  modelName={product.modelName}
                  minPrice={product.priceOrQuantity}
                  thumbnailUrl={product?.thumbnailUrl}
                  isScraped={product.isScraped}
                  onScrapClick={() => handleScrapClick(product.id)}
                  postType={
                    product.tradeType.toLowerCase() as "buying" | "selling"
                  }
                  isActive={product.isActive}
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
