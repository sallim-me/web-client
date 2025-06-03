import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Stack,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { productApi } from "../../../api/product";
import type { SellingPostDetail, BuyingPostDetail } from "../../../api/product";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [postType, setPostType] = useState<"selling" | "buying" | null>(null);
  const [postDetail, setPostDetail] = useState<
    SellingPostDetail | BuyingPostDetail | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    if (type === "selling" || type === "buying") {
      setPostType(type);
    } else {
      setError("잘못된 글 타입입니다.");
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    if (!id || !postType) return;

    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        if (postType === "selling") {
          const response = await productApi.getSellingPostDetail(parseInt(id));
          setPostDetail(response);
        } else if (postType === "buying") {
          const response = await productApi.getBuyingPostDetail(parseInt(id));
          setPostDetail(response);
        }
      } catch (error) {
        console.error("Error fetching post detail:", error);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id, postType]);

  const handleBack = () => {
    navigate(-1);
  };

  const getApplianceTypeText = (type: string) => {
    switch (type) {
      case "REFRIGERATOR":
        return "냉장고";
      case "WASHING_MACHINE":
        return "세탁기";
      case "AIR_CONDITIONER":
        return "에어컨";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (error || !postDetail) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography color="error">
          {error || "글을 찾을 수 없습니다."}
        </Typography>
      </Container>
    );
  }

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
            {postType === "selling" ? "판매글 상세" : "구매글 상세"}
          </Typography>
        </Stack>
      </Paper>

      {/* 글 내용 */}
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* 제목 */}
          <Typography variant="h5" component="h1">
            {postDetail.title}
          </Typography>

          {/* 상태 */}
          <Box>
            <Chip
              label={postDetail.isActive ? "거래 가능" : "거래 완료"}
              color={postDetail.isActive ? "success" : "default"}
              size="small"
            />
          </Box>

          {/* 기본 정보 */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              기본 정보
            </Typography>
            <Stack spacing={1}>
              <Typography>
                제품 종류: {getApplianceTypeText(postDetail.applianceType)}
              </Typography>
              {postType === "selling" && (
                <>
                  <Typography>
                    모델명: {(postDetail as SellingPostDetail).modelName}
                  </Typography>
                  <Typography>
                    모델 번호: {(postDetail as SellingPostDetail).modelNumber}
                  </Typography>
                  <Typography>
                    브랜드: {(postDetail as SellingPostDetail).brand}
                  </Typography>
                  <Typography>
                    판매가:{" "}
                    {(
                      postDetail as SellingPostDetail
                    ).price?.toLocaleString() || 0}
                    원
                  </Typography>
                  <Typography>
                    희망가:{" "}
                    {(
                      postDetail as SellingPostDetail
                    ).userPrice?.toLocaleString() || 0}
                    원
                  </Typography>
                </>
              )}
              {postType === "buying" && (
                <>
                  <Typography>
                    수량: {(postDetail as BuyingPostDetail).quantity}개
                  </Typography>
                </>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* 상세 설명 */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              상세 설명
            </Typography>
            <Typography whiteSpace="pre-wrap">{postDetail.content}</Typography>
          </Box>

          {/* 판매글일 경우 제품 상태 확인 */}
          {postType === "selling" &&
            (postDetail as SellingPostDetail).answers.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    제품 상태 확인
                  </Typography>
                  <Stack spacing={2}>
                    {(postDetail as SellingPostDetail).answers.map(
                      (answer: {
                        id: number;
                        questionId: number;
                        questionContent: string;
                        answerContent: string;
                      }) => (
                        <Box key={answer.id}>
                          <Typography variant="body2" color="text.secondary">
                            {answer.questionContent}
                          </Typography>
                          <Typography>{answer.answerContent}</Typography>
                        </Box>
                      )
                    )}
                  </Stack>
                </Box>
              </>
            )}

          {/* 채팅하기 버튼 */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!postDetail.isActive}
          >
            채팅하기
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PostDetail;
