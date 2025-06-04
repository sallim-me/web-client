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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { productApi } from "../../../api/product";
import type { SellingPostDetail, BuyingPostDetail } from "../../../api/product";
import { useAuthStore } from "../../../store/useAuthStore";
import { checkScrap, createScrap, deleteScrap } from "../../../api/scrap";
import { updateSellingPost, getApplianceQuestions } from "../../../api/product";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [postType, setPostType] = useState<"selling" | "buying" | null>(null);
  const [postDetail, setPostDetail] = useState<
    ((SellingPostDetail | BuyingPostDetail) & { isAuthor: boolean }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrapped, setIsScrapped] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userProfile = useAuthStore((state) => state.userProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [editQuestions, setEditQuestions] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);

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
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        if (!id || !postType) return;

        let apiResponse: SellingPostDetail | BuyingPostDetail | null = null;

        if (postType === "selling") {
          apiResponse = await productApi.getSellingPostDetail(Number(id));
        } else if (postType === "buying") {
          apiResponse = await productApi.getBuyingPostDetail(Number(id));
        }

        if (apiResponse) {
          const postDetailWithAuthor = apiResponse as (
            | SellingPostDetail
            | BuyingPostDetail
          ) & { isAuthor: boolean };
          setPostDetail(postDetailWithAuthor);
          console.log("Post Detail:", postDetailWithAuthor); // Add console log here
        }

        // 스크랩 상태 확인
        const scrapStatus = await checkScrap(Number(id));
        setIsScrapped(scrapStatus);
      } catch (error) {
        console.error("Error fetching post detail:", error);
        setError("게시글을 불러오는데 실패했습니다.");
        setPostDetail(null); // Reset postDetail on error
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id, postType, userProfile?.id]); // Add userProfile.id to dependencies

  const handleBack = () => {
    navigate(-1);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = async () => {
    handleMenuClose();
    if (!postDetail) return;
    // 기존 데이터로 폼 초기화
    setEditForm({
      ...postDetail,
      isActive: postDetail.isActive,
      answers: (postDetail as any).answers.map((a: any) => ({ ...a })),
    });
    // 질문 불러오기
    setEditLoading(true);
    try {
      const res = await getApplianceQuestions(postDetail.applianceType);
      setEditQuestions(res.data);
    } finally {
      setEditLoading(false);
      setEditOpen(true);
    }
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name as string]: value }));
  };

  const handleEditCategoryChange = async (e: any) => {
    const value = e.target.value;
    setEditForm((prev: any) => ({
      ...prev,
      applianceType: value,
      answers: [],
    }));
    setEditLoading(true);
    try {
      const res = await getApplianceQuestions(value);
      setEditQuestions(res.data);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditAnswerChange = (
    questionId: number,
    answerContent: string
  ) => {
    setEditForm((prev: any) => ({
      ...prev,
      answers: prev.answers.map((a: any) =>
        a.questionId === questionId ? { ...a, answerContent } : a
      ),
    }));
  };

  const handleTradeTypeChange = (e: any) => {
    const value = e.target.value;
    console.log("lsadjfls: " + typeof value);
    setEditForm((prev: any) => ({
      ...prev,
      isActive: value === "true",
    }));
  };

  const handleEditSubmit = async () => {
    if (!id) return;
    setEditLoading(true);
    try {
      await updateSellingPost(Number(id), {
        title: editForm.title,
        content: editForm.content,
        applianceType: editForm.applianceType,
        isActive: editForm.isActive,
        modelNumber: editForm.modelNumber,
        modelName: editForm.modelName,
        brand: editForm.brand,
        price: Number(editForm.price),
        userPrice: Number(editForm.userPrice),
        answers: editQuestions.map((q: any) => ({
          questionId: q.id,
          answerContent:
            editForm.answers.find((a: any) => a.questionId === q.id)
              ?.answerContent || "",
        })),
      });
      setEditOpen(false);
      window.location.reload();
    } catch (e) {
      alert("수정에 실패했습니다.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (!id) return;
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        if (postType === "selling") {
          await productApi.deleteSellingPost(Number(id));
        }
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("글 삭제에 실패했습니다.");
      }
    }
  };

  const handleScrap = async () => {
    if (!id) return;
    try {
      if (isScrapped) {
        await deleteScrap(Number(id));
      } else {
        await createScrap(Number(id));
      }
      setIsScrapped(!isScrapped);
    } catch (error) {
      console.error("Error toggling scrap:", error);
      alert("스크랩 상태 변경에 실패했습니다.");
    }
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
            {postDetail.title}
          </Typography>
          {postDetail.isAuthor ? (
            <>
              <IconButton onClick={handleMenuClick} size="small">
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>수정</MenuItem>
                <MenuItem onClick={handleDelete}>삭제</MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton onClick={handleScrap} size="small">
              {isScrapped ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          )}
        </Stack>
      </Paper>

      {/* 글 내용 */}
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
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
          <Button variant="contained" size="large" fullWidth>
            채팅하기
          </Button>
        </Stack>
      </Paper>
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>판매글 수정</DialogTitle>
        <DialogContent>
          {editLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
            >
              <CircularProgress />
            </Box>
          ) : (
            editForm && (
              <Stack spacing={2} mt={1}>
                <FormControl fullWidth required>
                  <InputLabel>거래 유형</InputLabel>
                  <Select
                    value={editForm.isActive}
                    onChange={handleTradeTypeChange}
                    label="거래 유형"
                  >
                    {postType === "selling"
                      ? [
                          <MenuItem key="ACTIVE" value="true">
                            판매
                          </MenuItem>,
                          <MenuItem key="COMPLETED" value="false">
                            판매 완료
                          </MenuItem>,
                        ]
                      : [
                          <MenuItem key="ACTIVE" value="true">
                            구매
                          </MenuItem>,
                          <MenuItem key="COMPLETED" value="false">
                            구매 완료
                          </MenuItem>,
                        ]}
                  </Select>
                </FormControl>
                <TextField
                  label="제목"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                />
                <TextField
                  label="상세 설명"
                  name="content"
                  value={editForm.content}
                  onChange={handleEditFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    name="applianceType"
                    value={editForm.applianceType}
                    label="카테고리"
                    onChange={handleEditCategoryChange}
                  >
                    <MenuItem value="REFRIGERATOR">냉장고</MenuItem>
                    <MenuItem value="WASHING_MACHINE">세탁기</MenuItem>
                    <MenuItem value="AIR_CONDITIONER">에어컨</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="모델명"
                  name="modelName"
                  value={editForm.modelName}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                />
                <TextField
                  label="모델 번호"
                  name="modelNumber"
                  value={editForm.modelNumber}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                />
                <TextField
                  label="브랜드"
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                />
                <TextField
                  label="판매가"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                  type="number"
                />
                <TextField
                  label="희망가"
                  name="userPrice"
                  value={editForm.userPrice}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                  type="number"
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    제품 상태 확인
                  </Typography>
                  <Stack spacing={2}>
                    {editQuestions.map((q: any) => (
                      <Box key={q.id}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {q.questionContent}
                        </Typography>
                        <TextField
                          value={
                            editForm.answers.find(
                              (a: any) => a.questionId === q.id
                            )?.answerContent || ""
                          }
                          onChange={(e) =>
                            handleEditAnswerChange(q.id, e.target.value)
                          }
                          fullWidth
                          required
                          placeholder="답변을 입력해주세요"
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={editLoading}>
            취소
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={editLoading}
          >
            수정
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostDetail;
