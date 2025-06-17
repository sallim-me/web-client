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
import PostCard from "@/components/PostCard";
import { memberApi, MyPost } from "@/api/member";
import { scrapApi, getScrapByProductId } from "@/api/scrap";
import { getImageUrl, DefaultImageType } from "@/utils/image";

// MyPost에 스크랩 상태를 추가한 확장 타입
interface MyPostWithScrap extends MyPost {
  isScraped?: boolean;
}

const MyPosts = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<MyPostWithScrap[]>([]);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await memberApi.getMyPosts();
        const postsData = response.data;

        // 각 포스트의 스크랩 상태를 확인
        const postsWithScrapStatus = await Promise.all(
          postsData.map(async (post) => {
            try {
              const scrapInfo = await getScrapByProductId(post.productId);
              return { ...post, isScraped: scrapInfo.isScraped };
            } catch (error) {
              console.error(
                `Failed to get scrap status for post ${post.productId}:`,
                error
              );
              return { ...post, isScraped: false };
            }
          })
        );

        setPosts(postsWithScrapStatus);
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

  const handleScrapClick = async (productId: number) => {
    try {
      const post = posts.find((p) => p.productId === productId);
      if (!post) return;

      if (post.isScraped) {
        await scrapApi.deleteScrapByProductId(productId);
        // Update the post's scrap status in the local state
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.productId === productId ? { ...p, isScraped: false } : p
          )
        );
      } else {
        await scrapApi.createScrap({ productId });
        // Update the post's scrap status in the local state
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.productId === productId ? { ...p, isScraped: true } : p
          )
        );
      }
    } catch (error: any) {
      console.error("Failed to toggle scrap:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        alert("스크랩 상태 변경에 실패했습니다.");
      }
    }
  };

  const handleBack = () => {
    navigate("/my-page");
  };

  const getCardImageType = (
    typeIdentifier: string | undefined,
    title: string
  ): DefaultImageType => {
    let finalType: DefaultImageType = "REFRIGERATOR"; // 기본값은 냉장고

    if (typeIdentifier) {
      const cleanedType = typeIdentifier
        .toUpperCase()
        .trim()
        .replace(/ /g, "_");
      switch (cleanedType) {
        case "TV":
          finalType = "AIRCONDITIONER";
          break;
        case "REFRIGERATOR":
          finalType = "REFRIGERATOR";
          break;
        case "WASHER":
        case "WASHING_MACHINE":
          finalType = "WASHER";
          break;
        case "AIR_CONDITIONER":
          finalType = "AIRCONDITIONER";
          break;
        default:
          break;
      }
    }

    // typeIdentifier로 적절한 이미지를 찾지 못했거나 없는 경우 제목에서 유추
    if (finalType === "REFRIGERATOR" && title) {
      const lowerCaseTitle = title.toLowerCase();
      if (lowerCaseTitle.includes("냉장고")) {
        finalType = "REFRIGERATOR";
      } else if (lowerCaseTitle.includes("세탁기")) {
        finalType = "WASHER";
      } else if (
        lowerCaseTitle.includes("에어컨") ||
        lowerCaseTitle.includes("에어콘")
      ) {
        finalType = "AIRCONDITIONER";
      } else if (
        lowerCaseTitle.includes("티비") ||
        lowerCaseTitle.includes("tv")
      ) {
        finalType = "AIRCONDITIONER"; // TV도 일단 에어컨 이미지 사용 (DefaultImageType에 TV 없음)
      }
    }
    return finalType;
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
          <Typography variant="h6">내가 쓴 글</Typography>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <Typography color="text.secondary">
            아직 작성한 글이 없어요.
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
            {currentPosts.map((post) => (
              <Grid item xs={6} sm={6} key={post.productId}>
                <PostCard
                  key={post.productId}
                  id={post.productId}
                  title={post.title}
                  modelName={post.modelName}
                  price={post.price}
                  quantity={null}
                  thumbnailUrl={
                    post.thumbnailUrl ||
                    getImageUrl(
                      null,
                      getCardImageType(post.category, post.title)
                    )
                  }
                  isScraped={post.isScraped || false}
                  onScrapClick={() => handleScrapClick(post.productId)}
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
