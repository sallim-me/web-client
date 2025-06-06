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
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { productApi } from "../../../api/product";
import type {
  SellingPostDetail,
  BuyingPostDetail,
  CreateCommentResponseData,
} from "../../../api/product";
import { checkScrap, scrapApi } from "../../../api/scrap";
import { updateSellingPost, getApplianceQuestions } from "../../../api/product";
import { useAuthStore } from "../../../store/useAuthStore";
import axios, { AxiosError } from "axios";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

// 수정 폼의 타입 정의
interface EditForm {
  title: string;
  content: string;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  isActive: boolean;
  answers: Array<{
    questionId: number;
    answerContent: string;
  }>;
  // 판매글 전용 필드
  modelNumber: string;
  modelName: string;
  brand: string;
  price: number;
  userPrice: number;
  // 구매글 전용 필드
  quantity: number;
}

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
  const [isScrapped, setIsScrapped] = useState(false);
  const [scrapId, setScrapId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    userProfile,
    fetchUserProfile,
    isLoading: isProfileLoading,
  } = useAuthStore();
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editQuestions, setEditQuestions] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [comments, setComments] = useState<CreateCommentResponseData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // 컴포넌트 마운트 시 userProfile 가져오기
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log("Fetching user profile...");
        await fetchUserProfile();
        console.log("User profile fetched:", userProfile);
        console.log("User nickname:", userProfile?.nickname);
        console.log("User memberId:", userProfile?.memberId);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    loadUserProfile();
  }, []);

  // userProfile이 변경될 때마다 nickname 로깅
  useEffect(() => {
    console.log("Current user profile:", {
      nickname: userProfile?.nickname,
      memberId: userProfile?.memberId,
    });
  }, [userProfile]);

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

        if (postType === "selling") {
          const response = await productApi.getSellingPostDetail(Number(id));
          setPostDetail(response);
        } else if (postType === "buying") {
          const response = await productApi.getBuyingPostDetail(Number(id));
          setPostDetail(response);
          console.log("Buying post detail fetched:", response);
        }
        // 스크랩 상태 확인
        const scrapStatus = await checkScrap(Number(id));
        setIsScrapped(scrapStatus);
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
    const initialForm: EditForm = {
      title: postDetail.title,
      content: postDetail.content,
      applianceType: postDetail.applianceType,
      isActive: postDetail.isActive,
      answers: [],
      modelNumber: "",
      modelName: "",
      brand: "",
      price: 0,
      userPrice: 0,
      quantity: (postDetail as BuyingPostDetail).quantity || 0,
    };

    setEditForm(initialForm);

    // 질문 불러오기 및 answers 초기화 (판매글인 경우에만 필요)
    if (postType === "selling") {
      setEditLoading(true);
      try {
        const res = await getApplianceQuestions(
          (postDetail as SellingPostDetail).applianceType
        );
        setEditQuestions(res.data);
        // 판매글일 경우에만 postDetail.answers를 editForm.answers로 복사
        setEditForm((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            answers:
              (postDetail as SellingPostDetail).answers?.map((a: any) => ({
                ...a,
              })) || [],
          };
        });
      } finally {
        setEditLoading(false);
      }
    } else {
      setEditQuestions([]); // 구매글일 경우 질문 목록 초기화
    }

    setEditOpen(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      if (!prev) return null;
      return { ...prev, [name as string]: value };
    });
  };

  const handleCategoryChange = async (
    newCategory: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER"
  ) => {
    if (!editForm) return;

    setEditLoading(true);
    try {
      // 새로운 카테고리의 질문 불러오기
      const res = await getApplianceQuestions(newCategory);
      setEditQuestions(res.data);

      // 카테고리 변경 시 답변 초기화
      setEditForm((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          applianceType: newCategory,
          answers: [], // 답변 초기화
        };
      });
    } catch (error) {
      console.error("Error loading questions:", error);
      alert("질문을 불러오는데 실패했습니다.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditAnswerChange = (
    questionId: number,
    answerContent: string
  ) => {
    setEditForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: prev.answers.map((a: any) =>
          a.questionId === questionId ? { ...a, answerContent } : a
        ),
      };
    });
  };

  const handleTradeTypeChange = (e: any) => {
    const value = e.target.value;
    console.log("lsadjfls: " + typeof value);
    setEditForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isActive: value === "true",
      };
    });
  };

  const handleEditSubmit = async () => {
    if (!id || !editForm || !postType) return;
    setEditLoading(true);
    try {
      if (postType === "selling") {
        // 판매글 수정
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
              editForm.answers?.find((a: any) => a.questionId === q.id)
                ?.answerContent || "",
          })),
        });
      } else if (postType === "buying") {
        // 구매글 수정
        await productApi.updateBuyingPost(Number(id), {
          title: editForm.title,
          content: editForm.content,
          applianceType: editForm.applianceType,
          isActive: editForm.isActive,
          quantity: Number(editForm.quantity),
        });
      }

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
        } else if (postType === "buying") {
          await productApi.deleteBuyingPost(Number(id));
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

    console.log("handleScrap called.");
    console.log("userProfile in handleScrap:", userProfile);
    console.log("userProfile?.memberId in handleScrap:", userProfile?.memberId);

    // Check if user is logged in
    if (!userProfile || !userProfile.memberId) {
      console.error("User profile not available for scrap operation.");
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      if (isScrapped) {
        // 스크랩 취소 (스크랩 ID 사용)
        if (scrapId) {
          await scrapApi.deleteScrap(scrapId);
          setIsScrapped(false);
          setScrapId(null);
        } else {
          console.error("Scrap ID not available for deletion.");
          alert(
            "스크랩 취소에 실패했습니다. (스크랩 ID 없음 - 새로고침 후 다시 시도해주세요.)"
          );
        }
      } else {
        // 스크랩 요청
        const response = await scrapApi.createScrap({ productId: Number(id) });
        if (response && response.id) {
          setScrapId(response.id);
          setIsScrapped(true);
        } else {
          console.error(
            "Failed to get scrap ID from createScrap response.",
            response
          );
          alert("스크랩 요청에 실패했습니다. (스크랩 ID 응답 오류)");
        }
      }
    } catch (error: AxiosError | any) {
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

  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const handleChat = (buyerId: number) => {
    // Implement the chat logic here
    console.log(`Chat with buyer ID: ${buyerId}`);
  };

  // 댓글 불러오기
  const fetchComments = async () => {
    if (!id) return;
    try {
      const response = await productApi.getComments(Number(id));
      console.log("Comments fetched:", response);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!id || !newComment.trim()) return;
    if (!userProfile) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    try {
      setCommentLoading(true);
      await productApi.createComment(Number(id), { content: newComment });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setCommentLoading(false);
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await productApi.deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

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
            editQuestions &&
            editQuestions.length > 0 &&
            editForm && (
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
                    {editQuestions.map((q: any) => (
                      <Box key={q.id}>
                        <Typography variant="body2" color="text.secondary">
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
              </>
            )}

          {/* 작성자 정보 및 채팅하기 버튼 (구매글인 경우) */}
          {postType === "buying" && postDetail && !postDetail.isAuthor && (
            <Paper elevation={0} sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {/* 작성자 프로필 */}
                <Avatar
                  sx={{
                    bgcolor: stringToColor(
                      (postDetail as BuyingPostDetail).buyerNickname || ""
                    ),
                    width: 40,
                    height: 40,
                    fontSize: 20,
                  }}
                >
                  {(postDetail as BuyingPostDetail).buyerNickname?.charAt(0) ||
                    ""}
                </Avatar>
                {/* 작성자 닉네임 */}
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  {(postDetail as BuyingPostDetail).buyerNickname}
                </Typography>
                {/* 채팅하기 버튼 (본인 글이 아닐 때만 표시)*/}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    handleChat((postDetail as BuyingPostDetail).buyerId)
                  }
                >
                  채팅
                </Button>
              </Stack>
            </Paper>
          )}

          {/* 거래 상태 칩 */}
          {postDetail.isActive ? (
            <Chip
              label={postType === "selling" ? "판매 진행중" : "구매 진행중"}
              color="primary"
              size="small"
              sx={{ width: "fit-content" }}
            />
          ) : (
            <Chip
              label={postType === "selling" ? "판매 완료" : "구매 완료"}
              color="default"
              size="small"
              sx={{ width: "fit-content" }}
            />
          )}

          {/* 상세 설명 */}
          <Typography variant="body1">{postDetail.content}</Typography>

          {/* 판매글 추가 정보 (모델명, 브랜드, 가격 등) */}
          {postType === "selling" && postDetail && (
            <>
              <Divider />
              <Typography variant="subtitle2" fontWeight="bold">
                모델명: {(postDetail as SellingPostDetail).modelName}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                브랜드: {(postDetail as SellingPostDetail).brand}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                가격: ₩
                {(postDetail as SellingPostDetail).price?.toLocaleString() || 0}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                희망가: ₩
                {(
                  postDetail as SellingPostDetail
                ).userPrice?.toLocaleString() || 0}
              </Typography>
              <Divider />
              {/* 제품 상태 확인 (판매글만 해당) */}
              {(postDetail as SellingPostDetail).answers &&
                (postDetail as SellingPostDetail).answers.length > 0 && (
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
                          // 명시적인 타입 사용
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
                )}
            </>
          )}
        </Stack>
      </Paper>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          댓글
        </Typography>

        {/* 댓글 작성 폼 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={
              userProfile
                ? "댓글을 작성해주세요"
                : "로그인이 필요한 서비스입니다."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={commentLoading || !userProfile || isProfileLoading}
          />
          <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              disabled={
                commentLoading ||
                !newComment.trim() ||
                !userProfile ||
                isProfileLoading
              }
            >
              댓글 작성
            </Button>
          </Box>
        </Box>

        {/* 댓글 목록 */}
        {isProfileLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack spacing={2}>
            {comments.map((comment) => {
              console.log("Comment comparison:", {
                commentNickname: comment.nickname,
                userProfileNickname: userProfile?.nickname,
                isEqual: comment.nickname === userProfile?.nickname,
              });

              const isMyComment =
                userProfile && comment.nickname === userProfile.nickname;
              console.log("Is my comment:", isMyComment);

              return (
                <Box
                  key={comment.commentId}
                  sx={{ p: 1, borderBottom: "1px solid #eee" }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      {isMyComment ? "나" : comment.nickname}
                    </Typography>
                    {isMyComment && (
                      <IconButton
                        size="small"
                        onClick={() => handleCommentDelete(comment.commentId)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  <Typography variant="body1">{comment.content}</Typography>
                </Box>
              );
            })}
          </Stack>
        )}
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
                <TextField
                  label="제목"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                />
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
                <FormControl fullWidth required>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    value={editForm.applianceType}
                    onChange={(e) =>
                      handleCategoryChange(
                        e.target.value as
                          | "REFRIGERATOR"
                          | "WASHING_MACHINE"
                          | "AIR_CONDITIONER"
                      )
                    }
                    label="카테고리"
                  >
                    <MenuItem value="REFRIGERATOR">냉장고</MenuItem>
                    <MenuItem value="WASHING_MACHINE">세탁기</MenuItem>
                    <MenuItem value="AIR_CONDITIONER">에어컨</MenuItem>
                  </Select>
                </FormControl>
                {postType === "buying" && (
                  <TextField
                    label="수량"
                    name="quantity"
                    value={editForm.quantity}
                    onChange={handleEditFormChange}
                    fullWidth
                    required
                    type="number"
                  />
                )}
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
                {postType === "selling" && (
                  <>
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
                  </>
                )}
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
