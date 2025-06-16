import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Pagination,
  CircularProgress,
  Skeleton,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PostCard from "@/components/PostCard";
import { getAllProducts, Product } from "@/api/product";
import { scrapApi } from "@/api/scrap";

const PostList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const postsPerPage = 10;

  // 이전 페이지 경로 저장
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  // location이 변경될 때마다 이전 페이지 경로 업데이트
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath !== "/post/list") {
      setPreviousPath(currentPath);
    }
  }, [location]);

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

  // URL 쿼리 파라미터에서 초기 상태 가져오기
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    // 이전 페이지가 post detail인 경우에만 필터링 상태 유지
    if (previousPath?.includes("/post/detail")) {
      const categories = searchParams.get("categories");
      return categories ? categories.split(",") : [];
    }
    return [];
  });

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    // 이전 페이지가 post detail인 경우에만 필터링 상태 유지
    if (previousPath?.includes("/post/detail")) {
      const statuses = searchParams.get("statuses");
      return statuses ? statuses.split(",") : [];
    }
    return [];
  });

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

  // URL 쿼리 파라미터 업데이트 함수
  const updateSearchParams = (
    categories: string[],
    statuses: string[],
    search: string
  ) => {
    const params = new URLSearchParams();
    if (categories.length > 0) {
      params.set("categories", categories.join(","));
    }
    if (statuses.length > 0) {
      params.set("statuses", statuses.join(","));
    }
    if (search) {
      params.set("search", search);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    updateSearchParams(selectedCategories, selectedStatuses, newSearchQuery);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      updateSearchParams(newCategories, selectedStatuses, searchQuery);
      return newCategories;
    });
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => {
      const newStatuses = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status];
      updateSearchParams(selectedCategories, newStatuses, searchQuery);
      return newStatuses;
    });
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
        return product.tradeType === type && product.isActive === isActive;
      });

    const searchMatch =
      !searchQuery ||
      (product.title &&
        product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.modelName &&
        product.modelName.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && statusMatch && searchMatch;
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
        await scrapApi.deleteScrapByProductId(productId);
        // Update the product's scrap status in the local state
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId
              ? { ...p, isScraped: false, scrapId: undefined }
              : p
          )
        );
      } else {
        const response = await scrapApi.createScrap({ productId });
        // Update the product's scrap status in the local state
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId
              ? { ...p, isScraped: true, scrapId: response.id }
              : p
          )
        );
      }
    } catch (error: any) {
      console.error("Failed to toggle scrap:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        alert("스크랩 처리 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ pb: "76px" }}>
        <Container maxWidth="sm" sx={{ px: 0, py: 1.5 }}>
          <Stack spacing={1.5}>
            {/* 카테고리 필터 스켈레톤 */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 2 }}>
              {[1, 2, 3].map((index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={60}
                  height={32}
                  sx={{ borderRadius: "16px" }}
                />
              ))}
            </Box>

            {/* 거래 상태 필터 스켈레톤 */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 2 }}>
              {[1, 2, 3, 4].map((index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={70}
                  height={32}
                  sx={{ borderRadius: "16px" }}
                />
              ))}
            </Box>

            <Divider />

            {/* 게시물 목록 스켈레톤 */}
            <Grid
              container
              spacing={0}
              justifyContent="center"
              sx={{ px: 0, width: "100%" }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={6} key={index} sx={{ p: 1 }}>
                  <Box
                    sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 1 }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={120}
                      sx={{ borderRadius: 1, mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={16}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="text" width="70%" height={18} />
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* 중앙 로딩 스피너 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={40} />
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ pb: "76px" }}>
      <Container maxWidth="sm" sx={{ px: 0, py: 1.5 }}>
        <Stack spacing={1.5}>
          {/* <Paper
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              p: 2,
              mb: 2,
              borderRadius: 0,
              // borderBottom: "1px solid",
              borderColor: "grey.200",
            }}
            elevation={0}
          >
            <Typography variant="h6" align="center">
              게시글 목록
            </Typography>
          </Paper> */}

          {/* 카테고리 필터 */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 2 }}>
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 2 }}>
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

          {/* 검색창 */}
          <Box sx={{ px: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="제목 또는 모델명 검색"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>

          <Divider />

          {/* 게시물 목록 */}
          <Grid
            container
            spacing={0}

            justifyContent="flex-start"
            sx={{ px: 0, width: "100%" }}
          >
            {currentProducts.map((product) => (
              <Grid
                item
                xs={currentProducts.length === 1 ? 12 : 6}
                key={product.id}
                sx={{ p: 1 }}
              >
                <PostCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  modelName={product.modelName}
                  price={product.price}
                  quantity={product.quantity}
                  thumbnailUrl={product?.thumbnailUrl}
                  isScraped={product.isScraped}
                  onScrapClick={() => handleScrapClick(product.id)}
                  postType={
                    product.tradeType.toLowerCase() as "buying" | "selling"
                  }
                  isActive={product.isActive}
                  applianceType={product.category}
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
              "@media (display-mode: standalone)": {
                "@supports (-webkit-touch-callout: none)": {
                  bottom: `calc(80px + env(safe-area-inset-bottom))`,
                  transform: "translate3d(0, 0, 0)",
                },
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
