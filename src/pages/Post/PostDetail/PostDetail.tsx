import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
  Skeleton,
  Backdrop,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/Chat";
import { scrapApi, getScrapByProductId } from "@/api/scrap";
import { getApplianceQuestions } from "@/api/product";
import { chatApi } from "@/api/chat";
import { useAuthStore } from "@/store/useAuthStore";
import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
import { PostPhoto } from "./PostPhoto";
import { PostPriceCard } from "./PostPriceCard";
import { productApi } from "@/api/product";
import type {
  SellingPostDetail,
  BuyingPostDetail,
  CreateCommentResponseData,
  UpdateSellingPostRequest,
  UpdateBuyingPostRequest,
} from "@/api/product";

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
  const [chatLoading, setChatLoading] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const fetchPostDetail = useCallback(async () => {
    try {
      setLoading(true);
      if (!id || !postType) return;

      if (postType === "selling") {
        const response = await productApi.getSellingPostDetail(Number(id));
        setPostDetail(response);
      } else if (postType === "buying") {
        const response = await productApi.getBuyingPostDetail(Number(id));
        setPostDetail(response);
      }
      // 스크랩 상태 확인
      try {
        const scrapInfo = await getScrapByProductId(Number(id));
        setIsScrapped(scrapInfo.isScraped);
      } catch (error) {
        console.error("Error checking scrap status:", error);
        setIsScrapped(false);
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id, postType]);

  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  // 컴포넌트 마운트 시 userProfile 가져오기
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log("Fetching user profile...");
        await fetchUserProfile();
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    loadUserProfile();
  }, [fetchUserProfile]);

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

  const handleBack = () => {
    navigate("/");
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = async () => {
    console.log("handleEdit called.");
    handleMenuClose();
    if (!postDetail) {
      console.log("No postDetail available.");
      return;
    }

    console.log("postDetail in handleEdit:", postDetail);

    try {
      if (postType === "selling") {
        // 판매글 수정 로직
        console.log(
          "Fetching questions for appliance type:",
          postDetail.applianceType
        );
        const questionsResponse = await getApplianceQuestions(
          postDetail.applianceType
        );
        console.log("Loaded questions:", questionsResponse.data);

        setEditQuestions(questionsResponse.data);

        const existingAnswers = (postDetail as SellingPostDetail).answers || [];
        console.log("Existing answers:", existingAnswers);

        const mappedAnswers = questionsResponse.data.map((q: any) => {
          const existingAnswer = existingAnswers.find(
            (a: any) => a.questionId === q.id
          );
          console.log(`Mapping question ${q.id}:`, {
            questionContent: q.questionContent,
            existingAnswer: existingAnswer?.answerContent,
          });
          return {
            questionId: q.id,
            answerContent: existingAnswer ? existingAnswer.answerContent : "",
          };
        });

        console.log("Mapped answers:", mappedAnswers);

        const initialForm: EditForm = {
          title: postDetail.title,
          content: postDetail.content,
          applianceType: postDetail.applianceType,
          isActive: postDetail.isActive,
          modelName: (postDetail as SellingPostDetail).modelName || "",
          brand: (postDetail as SellingPostDetail).brand || "",
          price: (postDetail as SellingPostDetail).price || 0,
          userPrice: (postDetail as SellingPostDetail).userPrice || 0,
          quantity: (postDetail as BuyingPostDetail).quantity || 0,
          answers: mappedAnswers,
        };

        console.log("Setting initial form for selling post:", initialForm);
        setEditForm(initialForm);
        setEditOpen(true);
      } else if (postType === "buying") {
        // 구매글 수정 로직
        const initialForm: EditForm = {
          title: postDetail.title,
          content: postDetail.content,
          applianceType: postDetail.applianceType,
          isActive: postDetail.isActive,
          modelName: "",
          brand: "",
          price: 0,
          userPrice: 0,
          quantity: (postDetail as BuyingPostDetail).quantity || 0,
          answers: [],
        };

        console.log("Setting initial form for buying post:", initialForm);
        setEditForm(initialForm);
        setEditOpen(true);
      }
    } catch (error) {
      console.error("Error in handleEdit:", error);
      alert("게시글 수정 정보를 불러오는데 실패했습니다.");
    }
  };

  // 2. setEditForm 이후 editForm 값 출력 (컴포넌트 최상단에 위치)
  useEffect(() => {
    if (editForm) {
      console.log("editForm after setEditForm:", editForm);
    }
  }, [editForm]);

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
    console.log("handleEditAnswerChange called:", {
      questionId,
      answerContent,
    });
    setEditForm((prev) => {
      if (!prev) return null;

      const existingAnswerIndex = prev.answers.findIndex(
        (a) => a.questionId === questionId
      );
      console.log("Existing answer index:", existingAnswerIndex);

      let updatedAnswers;
      if (existingAnswerIndex >= 0) {
        // 기존 답변이 있으면 업데이트
        updatedAnswers = [...prev.answers];
        updatedAnswers[existingAnswerIndex] = {
          questionId,
          answerContent,
        };
      } else {
        // 새로운 답변 추가
        updatedAnswers = [...prev.answers, { questionId, answerContent }];
      }

      console.log("Updated answers:", updatedAnswers);
      return {
        ...prev,
        answers: updatedAnswers,
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
    if (!editForm || !postDetail || !id) {
      console.log("Missing editForm, postDetail, or id.", {
        editForm,
        postDetail,
        id,
      });
      return;
    }

    setEditLoading(true);
    try {
      if (postType === "selling") {
        const data: UpdateSellingPostRequest = {
          title: editForm.title,
          content: editForm.content,
          applianceType: editForm.applianceType,
          isActive: editForm.isActive,
          modelName: editForm.modelName,
          brand: editForm.brand,
          price: editForm.price,
          userPrice: editForm.userPrice,
          answers: editForm.answers,
        };
        console.log("Sending update request with data:", data);
        await productApi.updateSellingPost(parseInt(id), data);
      } else if (postType === "buying") {
        const data: UpdateBuyingPostRequest = {
          title: editForm.title,
          content: editForm.content,
          quantity: editForm.quantity,
          applianceType: editForm.applianceType,
          isActive: editForm.isActive,
        };
        console.log("Sending buying post update request with data:", data);
        await productApi.updateBuyingPost(parseInt(id), data);
      }
      setEditOpen(false);
      await fetchPostDetail();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("게시글 수정에 실패했습니다.");
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
    if (!userProfile?.memberId) {
      console.error("User profile not available for scrap operation.");
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      if (isScrapped) {
        // 스크랩 취소 - productId를 기반으로 삭제
        await scrapApi.deleteScrapByProductId(Number(id));
        setIsScrapped(false);
      } else {
        // 스크랩 요청
        const response = await scrapApi.createScrap({ productId: Number(id) });
        if (response && response.id) {
          setIsScrapped(true);
        } else {
          console.error(
            "Failed to get scrap ID from createScrap response.",
            response
          );
          alert("스크랩 요청에 실패했습니다. (스크랩 ID 응답 오류)");
        }
      }
    } catch (error: any) {
      console.error("Error toggling scrap:", error);

      // 401 Unauthorized 에러인 경우 로그인 필요 메시지 표시
      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        alert("스크랩 상태 변경에 실패했습니다.");
      }
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

  const handleChat = async (buyerId?: number) => {
    if (!id || !userProfile) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      setChatLoading(true);

      // 채팅방 생성 또는 기존 채팅방 찾기
      const response = await chatApi.createChatRoom({
        productId: Number(id),
      });

      if (response.data && response.data.id) {
        // 채팅방 생성/조회 성공 시 해당 채팅방으로 이동
        navigate(`/chat/${response.data.id}`);
      } else {
        alert("채팅방 생성에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Error creating/finding chat room:", error);

      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else if (error.response?.status === 400) {
        alert(
          "채팅방을 생성할 수 없습니다. (본인 글이거나 이미 채팅방이 존재할 수 있습니다)"
        );
      } else {
        alert("채팅방 연결에 실패했습니다.");
      }
    } finally {
      setChatLoading(false);
    }
  };

  // 판매글에서 구매자와 채팅 시작
  const handleStartChatForSeller = async () => {
    if (!userProfile || !postDetail) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (userProfile.memberId === postDetail.memberId) {
      alert("자신의 게시글에는 채팅을 시작할 수 없습니다.");
      return;
    }

    try {
      setChatLoading(true);

      // 채팅방 생성
      const chatResponse = await chatApi.createChatRoom({
        productId: postDetail.id,
      });

      if (chatResponse.data?.id) {
        navigate(`/chat/${chatResponse.data.id}`);
      } else {
        throw new Error("채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setChatLoading(false);
    }
  };

  // 구매글에서 판매자와 채팅 시작 (기존과 유사하지만 명확하게 분리)
  const handleStartChatForBuyer = async () => {
    if (!userProfile || !postDetail) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (userProfile.memberId === postDetail.memberId) {
      alert("자신의 게시글에는 채팅을 시작할 수 없습니다.");
      return;
    }

    try {
      setChatLoading(true);

      // 채팅방 생성
      const chatResponse = await chatApi.createChatRoom({
        productId: postDetail.id,
      });

      if (chatResponse.data?.id) {
        navigate(`/chat/${chatResponse.data.id}`);
      } else {
        throw new Error("채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setChatLoading(false);
    }
  };

  // 댓글 불러오기
  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const response = await productApi.getComments(Number(id));
      console.log("Comments fetched:", response);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [id]);

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
  }, [fetchComments]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ pb: "76px" }}>
        {/* 헤더 스켈레톤 */}
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
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="60%" height={28} sx={{ flex: 1 }} />
            <Skeleton variant="circular" width={24} height={24} />
          </Stack>
        </Paper>

        {/* 사진 영역 스켈레톤 */}
        <Box sx={{ p: 2 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ borderRadius: 2, mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
            {[1, 2, 3, 4].map((index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={120}
                height={120}
                sx={{ borderRadius: 2, flexShrink: 0 }}
              />
            ))}
          </Box>
        </Box>

        {/* 글 내용 스켈레톤 */}
        <Paper sx={{ p: 2, boxShadow: "none" }}>
          <Stack spacing={2}>
            {/* 상태 칩 스켈레톤 */}
            <Skeleton variant="rounded" width={80} height={24} />

            {/* 기본 정보 스켈레톤 */}
            <Box>
              <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="75%" height={20} />
                <Skeleton variant="text" width="85%" height={20} />
              </Stack>
            </Box>

            <Divider />

            {/* 상세 설명 스켈레톤 */}
            <Box>
              <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>

            <Divider />

            {/* 가격 차트 스켈레톤 */}
            <Box>
              <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Stack>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* 댓글 섹션 스켈레톤 */}
        <Paper sx={{ p: 2, mt: 2, boxShadow: "none" }}>
          <Skeleton variant="text" width={80} height={28} sx={{ mb: 2 }} />

          {/* 댓글 작성 폼 스켈레톤 */}
          <Box sx={{ mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={80}
              sx={{ borderRadius: 1, mb: 1 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Skeleton variant="rounded" width={100} height={36} />
            </Box>
          </Box>

          {/* 댓글 목록 스켈레톤 */}
          <Stack spacing={2}>
            {[1, 2, 3].map((index) => (
              <Box key={index} sx={{ p: 1, borderBottom: "1px solid #eee" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Skeleton variant="text" width={80} height={16} />
                  <Skeleton variant="circular" width={16} height={16} />
                </Stack>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            ))}
          </Stack>
        </Paper>
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

      {/* 사진 영역 */}
      {postType === "selling" && postDetail && (
        <Box sx={{ px: 2 }}>
          <PostPhoto productId={postDetail.id} />
        </Box>
      )}

      {/* 글 내용 */}
      <Paper sx={{ p: 2, boxShadow: "none" }}>
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

          {/* 거래 상태 칩 */}
          {/* {postDetail.isActive ? (
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
          )} */}

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
              {/* <Typography variant="subtitle2" fontWeight="bold">
                희망가: ₩
                {(
                  postDetail as SellingPostDetail
                ).userPrice?.toLocaleString() || 0}
              </Typography> */}

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

        <Divider sx={{ py: 2 }} />

        {/* 가격 차트는 판매글인 경우에만 표시 */}
        {postType === "selling" && (
          <PostPriceCard
            modelName={(postDetail as SellingPostDetail).modelName}
            brand={(postDetail as SellingPostDetail).brand}
            currentPrice={(postDetail as SellingPostDetail).price}
            userPrice={(postDetail as SellingPostDetail).userPrice}
          />
        )}
      </Paper>

      {/* 작성자 정보 및 채팅하기 버튼 (판매글인 경우) */}
      {postType === "selling" && postDetail && !postDetail.isAuthor && (
        <Paper elevation={0} sx={{ p: 2, boxShadow: "none" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* 작성자 프로필 */}
            <Avatar
              sx={{
                bgcolor: stringToColor(
                  `User${(postDetail as SellingPostDetail).memberId}` || ""
                ),
                width: 40,
                height: 40,
                fontSize: 20,
              }}
            >
              {`U${(postDetail as SellingPostDetail).memberId}`.charAt(0) ||
                "U"}
            </Avatar>
            {/* 작성자 닉네임 */}
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {(postDetail as SellingPostDetail).nickname}
            </Typography>
            {/* 채팅하기 버튼 (본인 글이 아닐 때만 표시)*/}
            <Button
              variant="contained"
              size="small"
              onClick={handleStartChatForSeller}
              disabled={isCreatingChat}
              startIcon={
                isCreatingChat ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <ChatIcon />
                )
              }
              sx={{
                minWidth: 120,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                "&:disabled": {
                  bgcolor: "grey.400",
                },
              }}
            >
              {isCreatingChat ? "채팅방 생성중..." : "채팅하기"}
            </Button>
          </Stack>
        </Paper>
      )}

      {/* 작성자 정보 및 채팅하기 버튼 (구매글인 경우) */}
      {postType === "buying" && postDetail && !postDetail.isAuthor && (
        <Paper elevation={0} sx={{ p: 2, boxShadow: "none" }}>
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
              {(postDetail as BuyingPostDetail).buyerNickname?.charAt(0) || ""}
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

      <Divider sx={{ my: 2 }} />

      <Paper sx={{ p: 2, mt: 2, boxShadow: "none" }}>
        <Typography variant="h6" gutterBottom>
          댓글
        </Typography>

        {/* 댓글 목록 */}
        {isProfileLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack spacing={2}>
            {comments
              .slice()
              .reverse()
              .map((comment) => {
                console.log("Comment comparison:", {
                  commentNickname: comment.nickname,
                  userProfileNickname: userProfile?.nickname,
                  isEqual: comment.nickname === userProfile?.nickname,
                });

                const isMyComment = userProfile?.nickname === comment.nickname;
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

        {/* 댓글 작성 폼 */}
        <Box sx={{ mt: 2 }}>
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
                {postType === "selling" ? (
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
                      label="상세 설명"
                      name="content"
                      value={editForm.content}
                      onChange={handleEditFormChange}
                      fullWidth
                      multiline
                      rows={3}
                      required
                    />
                    {postType === "selling" &&
                      editQuestions &&
                      editQuestions.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ mb: 2, fontWeight: "bold" }}
                          >
                            제품 상태 확인
                          </Typography>
                          <Stack spacing={2}>
                            {editQuestions.map((q: any) => {
                              const answer = editForm.answers.find(
                                (a: any) => a.questionId === q.id
                              );
                              console.log(`Rendering question ${q.id}:`, {
                                questionContent: q.questionContent,
                                answer: answer?.answerContent,
                              });
                              return (
                                <Box key={q.id}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    {q.questionContent}
                                  </Typography>
                                  <TextField
                                    value={answer?.answerContent || ""}
                                    onChange={(e) =>
                                      handleEditAnswerChange(
                                        q.id,
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                    required
                                    placeholder="답변을 입력해주세요"
                                  />
                                </Box>
                              );
                            })}
                          </Stack>
                        </Box>
                      )}
                  </>
                ) : (
                  <>
                    <TextField
                      label="수량"
                      name="quantity"
                      value={editForm.quantity}
                      onChange={handleEditFormChange}
                      fullWidth
                      required
                      type="number"
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
