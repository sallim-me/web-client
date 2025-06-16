import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Skeleton,
  CircularProgress,
  Dialog,
  DialogContent,
  Fab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createBuyingPost,
  createSellingPost,
  getApplianceQuestions,
  analyzeImage,
  UpdateBuyingPostRequest,
  UpdateSellingPostRequest,
  SellingPostDetail,
  BuyingPostDetail,
  productApi,
} from "@/api/product";
import { useAuthStore } from "@/store/useAuthStore";

interface PostForm {
  title: string;
  tradeType: string;
  category: string;
  modelNumber: string;
  modelName: string;
  brand: string;
  price: string;
  userPrice: string;
  description: string;
  quantity: string;
  images: string[]; // 새로 업로드될 이미지의 미리보기 URL 또는 기존 이미지 URL
  imageFiles: File[]; // 새로 업로드될 실제 파일 객체들
  existingImageUrls: string[]; // 서버에 이미 저장된 이미지 URL들 (수정 시)
  deletedImageUrls: string[]; // 삭제될 이미지 URL들 (수정 시)
  defectAnswers: Record<string, string>;
}

interface ApplianceQuestion {
  id: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  questionContent: string;
}

const PostCreate = () => {
  const navigate = useNavigate();
  const { id: postId } = useParams<{ id: string }>(); // 게시글 ID를 URL에서 가져옵니다.
  const location = useLocation();
  const [form, setForm] = useState<PostForm>({
    title: "",
    tradeType: "",
    category: "",
    modelNumber: "",
    modelName: "",
    brand: "",
    price: "",
    userPrice: "",
    description: "",
    quantity: "",
    images: [],
    imageFiles: [],
    existingImageUrls: [],
    deletedImageUrls: [],
    defectAnswers: {},
  });
  const [questions, setQuestions] = useState<ApplianceQuestion[]>([]);
  const [autoFilled, setAutofilled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(
    new Set()
  );
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  // 드래그 모드 상태 추가
  const [isDragMode, setIsDragMode] = useState(false);
  // AI 분석용 이미지 선택 상태 추가
  const [selectedAnalysisImage, setSelectedAnalysisImage] = useState<
    number | null
  >(null);
  const [isSelectingImage, setIsSelectingImage] = useState(false);

  // 드래그 앤 드롭과 이미지 뷰어를 위한 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 게시글 수정 시 데이터 로드
  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        const params = new URLSearchParams(location.search);
        const tradeTypeParam = params.get("type");

        if (!tradeTypeParam) {
          alert("게시글 유형 정보가 부족합니다.");
          navigate("/");
          return;
        }

        try {
          if (tradeTypeParam === "selling") {
            const response = await productApi.getSellingPostDetail(
              parseInt(postId)
            );
            const post = response;

            setForm({
              title: post.title,
              tradeType: "sell",
              category: post.applianceType,
              modelNumber: post.modelNumber || "",
              modelName: post.modelName || "",
              brand: post.brand || "",
              price: post.price?.toString() || "",
              userPrice: post.userPrice?.toString() || "",
              description: post.content,
              quantity: "", // 판매글에는 수량 없음
              images: post.images || [],
              imageFiles: [], // 수정 시 새로운 파일은 여기에 추가
              existingImageUrls: post.images || [],
              deletedImageUrls: [],
              defectAnswers: post.answers.reduce(
                (
                  acc: Record<string, string>,
                  answer: { questionContent: string; answerContent: string }
                ) => {
                  acc[answer.questionContent] = answer.answerContent;
                  return acc;
                },
                {} as Record<string, string>
              ),
            });
            // 질문 불러오기
            const questionsResponse = await getApplianceQuestions(
              post.applianceType
            );
            setQuestions(questionsResponse.data);
          } else if (tradeTypeParam === "buying") {
            const response = await productApi.getBuyingPostDetail(
              parseInt(postId)
            );
            const post = response;

            setForm({
              title: post.title,
              tradeType: "buy",
              category: post.applianceType,
              modelNumber: "",
              modelName: "",
              brand: "",
              price: "",
              userPrice: "",
              description: post.content,
              quantity: post.quantity?.toString() || "",
              images: [], // 구매글에는 이미지 없음
              imageFiles: [],
              existingImageUrls: [],
              deletedImageUrls: [],
              defectAnswers: {},
            });
          }
        } catch (error) {
          console.error("Error fetching post for edit:", error);
          alert("게시글을 불러오는데 실패했습니다.");
          navigate("/"); // 에러 발생 시 목록 페이지로 이동
        } finally {
          setIsSubmitting(false); // 로딩 상태 종료 (PostCreate 내부에 로딩 상태 추가 필요)
        }
      } else {
        setIsSubmitting(false); // 새로 생성하는 경우에도 로딩 상태 종료
      }
    };
    fetchPostData();
  }, [postId, navigate, location.search]); // 의존성 배열에 추가

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (postId) {
        // 게시글 수정
        if (form.tradeType === "buy") {
          const data: UpdateBuyingPostRequest = {
            title: form.title,
            content: form.description,
            quantity: parseInt(form.quantity),
            applianceType: form.category.toUpperCase() as
              | "REFRIGERATOR"
              | "WASHING_MACHINE"
              | "AIR_CONDITIONER",
            isActive: true, // 수정 시 활성 상태는 유지
          };
          await productApi.updateBuyingPost(parseInt(postId), data);
        } else {
          // 판매글 수정
          const answers = questions.map((question) => ({
            questionId: question.id,
            answerContent: form.defectAnswers[question.questionContent] || "",
          }));

          const baseRequestData = {
            title: form.title,
            content: form.description,
            applianceType: form.category.toUpperCase() as
              | "REFRIGERATOR"
              | "WASHING_MACHINE"
              | "AIR_CONDITIONER",
            modelName: form.modelName,
            brand: form.brand,
            price: parseInt(form.price),
            userPrice: parseInt(form.userPrice),
            answers,
          };

          await productApi.updateSellingPost(
            parseInt(postId),
            {
              ...baseRequestData,
              isActive: true,
            },
            form.imageFiles,
            form.deletedImageUrls
          );
        }
        navigate(
          `/post/detail/${postId}?type=${
            form.tradeType === "sell" ? "selling" : "buying"
          }`
        );
      } else {
        // 게시글 생성
        if (form.tradeType === "buy") {
          const userProfile = useAuthStore.getState().userProfile;
          console.log("Submitting as buyer, user profile:", userProfile);

          if (!userProfile?.isBuyer) {
            alert("바이어로 등록된 사용자만 구매글을 작성할 수 있습니다.");
            setIsSubmitting(false);
            return;
          }

          const data = {
            title: form.title,
            content: form.description,
            applianceType: form.category.toUpperCase() as
              | "REFRIGERATOR"
              | "WASHING_MACHINE"
              | "AIR_CONDITIONER",
            quantity: parseInt(form.quantity),
          };

          console.log("Submitting buying post data:", data);
          const response = await createBuyingPost(data);

          // 구매글 생성 성공 시 상세 페이지로 이동
          if (response.data && response.data.id) {
            navigate(`/post/detail/${response.data.id}?type=buying`);
          } else {
            navigate("/");
          }
        } else {
          const userProfile = useAuthStore.getState().userProfile;
          if (!userProfile) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            setIsSubmitting(false);
            return;
          }

          // 판매글 작성
          const answers = questions.map((question) => ({
            questionId: question.id,
            answerContent: form.defectAnswers[question.questionContent] || "",
          }));

          const baseRequestData = {
            title: form.title,
            content: form.description,
            applianceType: form.category.toUpperCase() as
              | "REFRIGERATOR"
              | "WASHING_MACHINE"
              | "AIR_CONDITIONER",
            modelName: form.modelName,
            brand: form.brand,
            price: parseInt(form.price),
            userPrice: parseInt(form.userPrice),
            answers,
          };

          console.log("Submitting selling post data:", baseRequestData);
          console.log("Image files:", form.imageFiles);
          const response = await createSellingPost(
            {
              ...baseRequestData,
              modelNumber: form.modelNumber,
            },
            form.imageFiles
          );

          // 판매글 생성 성공 시 상세 페이지로 이동
          if (response.data && response.data.id) {
            navigate(`/post/detail/${response.data.id}?type=selling`);
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시글 작성에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;

    // 자동완성된 필드가 수정되면 autoFilled를 false로 변경
    if (autoFilled && autoFilledFields.has(name as string)) {
      setAutofilled(false);
    }

    setForm((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = async (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    // 거래 유형이 변경되면 자동완성 상태 초기화
    if (name === "tradeType") {
      setAutofilled(false);
      setAutoFilledFields(new Set());
      setIsSelectingImage(false);
      setSelectedAnalysisImage(null);

      // 거래 유형이 변경되면 이미지 관련 필드들도 초기화
      setForm((prev) => ({
        ...prev,
        images: [],
        imageFiles: [],
        category: "",
        modelNumber: "",
        modelName: "",
        brand: "",
        price: "",
        userPrice: "",
        description: "",
        quantity: "",
        defectAnswers: {},
      }));

      if (value === "buy") {
        const userProfile = useAuthStore.getState().userProfile;
        console.log("User profile:", userProfile);

        if (!userProfile) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        if (!userProfile.isBuyer) {
          console.error("User is not a buyer:", userProfile);
          alert("바이어로 등록된 사용자만 구매글을 작성할 수 있습니다.");
          return;
        }

        console.log("User is a buyer, proceeding with post creation");
      }
    }

    if (name === "category") {
      try {
        const response = await getApplianceQuestions(
          value.toUpperCase() as
            | "REFRIGERATOR"
            | "WASHING_MACHINE"
            | "AIR_CONDITIONER"
        );
        setQuestions(response.data);

        // 구매글인 경우 카테고리에 맞는 기본 이미지 설정
        if (form.tradeType === "buy") {
          let defaultImage = "";
          switch (value.toUpperCase()) {
            case "REFRIGERATOR":
              defaultImage = "/images/refrigerator.png";
              break;
            case "WASHING_MACHINE":
              defaultImage = "/images/washing_machine.png";
              break;
            case "AIR_CONDITIONER":
              defaultImage = "/images/air_conditioner.png";
              break;
          }
          setForm((prev) => ({
            ...prev,
            images: [defaultImage],
          }));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("질문을 불러오는데 실패했습니다.");
      }
    }

    // tradeType이 아닌 경우에만 기본 form 업데이트 수행
    if (name !== "tradeType") {
      setForm((prev) => ({
        ...prev,
        [name]: name === "category" ? value.toUpperCase() : value,
      }));
    } else {
      // tradeType인 경우 값만 업데이트 (이미 위에서 초기화했음)
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.images.length > 5) {
      alert("최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  const handleImageDelete = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const handleDefectQuestionChange = (question: string, answer: string) => {
    setForm((prev) => ({
      ...prev,
      defectAnswers: {
        ...prev.defectAnswers,
        [question]: answer,
      },
    }));
  };

  const handleAutoFill = async (selectedImageIndex?: number) => {
    if (form.images.length === 0 || form.imageFiles.length === 0) {
      alert("분석할 이미지를 먼저 업로드해주세요.");
      return;
    }

    // 이미지 선택 모드 시작
    if (!isSelectingImage && selectedImageIndex === undefined) {
      setIsSelectingImage(true);
      // alert("AI 분석에 사용할 사진을 선택해주세요.");
      return;
    }

    // 선택된 이미지 인덱스 사용, 없으면 0번째 이미지 사용
    const imageIndex =
      selectedImageIndex !== undefined ? selectedImageIndex : 0;

    setIsAnalyzing(true);
    setIsSelectingImage(false);
    setSelectedAnalysisImage(null);

    try {
      // 선택된 이미지 파일 사용
      const file = form.imageFiles[imageIndex];

      const result = await analyzeImage(file);

      if (result.success) {
        // 자동완성된 필드들을 추적
        const filledFields = new Set<string>();

        setForm((prev) => {
          const newForm = { ...prev };

          if (result.title) {
            newForm.title = result.title;
            filledFields.add("title");
          }
          if (result.category) {
            newForm.category = result.category;
            filledFields.add("category");
          }
          if (result.model_code) {
            newForm.modelName = result.model_code;
            filledFields.add("modelName");
          }
          if (result.brand) {
            newForm.brand = result.brand;
            filledFields.add("brand");
          }
          if (result.price) {
            newForm.price = result.price.toString();
            filledFields.add("price");
          }
          if (result.description) {
            newForm.description = result.description;
            filledFields.add("description");
          }

          return newForm;
        });

        setAutoFilledFields(filledFields);
        setAutofilled(true);

        // 카테고리가 변경되었으므로 질문들도 다시 불러오기
        try {
          const questionsResponse = await getApplianceQuestions(
            result.category
          );
          setQuestions(questionsResponse.data);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      } else {
        alert("이미지 분석에 실패했습니다. 다른 이미지를 시도해주세요.");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("이미지 분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateForm = () => {
    if (!form.title || !form.tradeType || !form.category || !form.description) {
      alert("모든 필수 항목을 입력해주세요.");
      return false;
    }

    // 구매 글일 경우 수량이 3 이상인지 확인
    /*
    if (form.tradeType === "buy") {
      const quantity = parseInt(form.quantity);
      if (isNaN(quantity) || quantity < 3) {
        alert("수량은 3 이상이어야 합니다.");
        return false;
      }
    }
    */

    return true;
  };

  // SortableImageItem 컴포넌트
  interface SortableImageItemProps {
    id: string;
    image: string;
    index: number;
    onDelete: (index: number) => void;
    onImageClick: (index: number) => void;
    isDragMode: boolean;
    isSelectingImage?: boolean;
    isSelectedForAnalysis?: boolean;
  }

  const SortableImageItem: React.FC<SortableImageItemProps> = ({
    id,
    image,
    index,
    onDelete,
    onImageClick,
    isDragMode,
    isSelectingImage = false,
    isSelectedForAnalysis = false,
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id,
      disabled: !isDragMode, // 드래그 모드가 아닐 때는 드래그 비활성화
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          position: "relative",
          width: 100,
          height: 100,
          cursor: isDragMode ? (isDragging ? "grabbing" : "grab") : "pointer",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            borderRadius: 1,
            overflow: "hidden",
            border: isDragging
              ? "2px dashed #ccc"
              : isDragMode
              ? "2px solid #1976d2"
              : isSelectingImage
              ? isSelectedForAnalysis
                ? "3px solid #4caf50"
                : "2px solid #ff9800"
              : "none",
            touchAction: isDragMode ? "none" : "auto", // 터치 이벤트 제어
            transition: "border 0.2s ease",
          }}
          {...(isDragMode ? { ...attributes, ...listeners } : {})} // 드래그 모드일 때만 드래그 리스너 활성화
        >
          <img
            src={image}
            alt={`Uploaded ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: isDragMode ? "inherit" : "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDragMode) {
                // 드래그 모드가 아닐 때만 이미지 클릭 가능
                onImageClick(index);
              }
            }}
          />
          {/* 드래그 모드일 때만 드래그 인디케이터 표시 */}
          {isDragMode && (
            <Box
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "rgba(0,0,0,0.7)",
                borderRadius: "50%",
                p: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DragIndicatorIcon
                sx={{
                  color: "white",
                  fontSize: 14,
                  pointerEvents: "none",
                }}
              />
            </Box>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            bgcolor: "background.paper",
            "&:hover": {
              bgcolor: "background.paper",
            },
            zIndex: 2,
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = form.images.findIndex(
        (_, index) => `image-${index}` === active.id
      );
      const newIndex = form.images.findIndex(
        (_, index) => `image-${index}` === over?.id
      );

      setForm((prev) => ({
        ...prev,
        images: arrayMove(prev.images, oldIndex, newIndex),
        imageFiles: arrayMove(prev.imageFiles, oldIndex, newIndex),
      }));
    }
  };

  // 이미지 클릭 핸들러 (뷰어 열기)
  const handleImageClick = (index: number) => {
    // 이미지 선택 모드일 때는 선택 로직 실행
    if (isSelectingImage) {
      setSelectedAnalysisImage(index);
      handleAutoFill(index); // 선택된 이미지로 자동 채우기 실행
      return;
    }

    // 일반 모드일 때는 뷰어 열기
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
    setZoom(1);
    setRotation(0);
  };

  // 이미지 뷰어 닫기
  const handleCloseImageViewer = () => {
    setImageViewerOpen(false);
    setSelectedImageIndex(null);
    setZoom(1);
    setRotation(0);
  };

  // 이미지 뷰어 네비게이션
  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleNextImage = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < form.images.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
      setZoom(1);
      setRotation(0);
    }
  };

  // 줌 컨트롤
  const handleZoomIn = () => {
    if (zoom < 3) setZoom(zoom + 0.5);
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom(zoom - 0.5);
  };

  // 회전 컨트롤
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={0}
          sx={{ mr: "32px" }}
        >
          <IconButton onClick={handleBack} size="small" disabled={isSubmitting}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
            글 작성
          </Typography>
        </Stack>
      </Paper>

      {/* 글 작성 폼 */}
      <Paper
        sx={{
          p: 3,
          boxShadow: "none",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 제목 */}
            {isAnalyzing ? (
              <Skeleton variant="rectangular" height={56} />
            ) : (
              <TextField
                color="primary"
                label="제목"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                sx={{
                  textDecoration:
                    autoFilled && autoFilledFields.has("title")
                      ? "underline"
                      : "none",
                  color:
                    autoFilled && autoFilledFields.has("title")
                      ? "primary.main"
                      : "text.primary",
                }}
              />
            )}

            {/* 거래 유형 */}
            <FormControl fullWidth required>
              <InputLabel>거래 유형</InputLabel>
              <Select
                name="tradeType"
                value={form.tradeType}
                label="거래 유형"
                onChange={handleSelectChange}
                disabled={isAnalyzing}
              >
                <MenuItem value="sell">판매</MenuItem>
                <MenuItem value="buy">구매</MenuItem>
              </Select>
            </FormControl>

            {/* 판매일 때만 이미지 업로드 표시 */}
            {form.tradeType === "sell" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexGrow: 1,
                    }}
                  >
                    <Typography variant="h6">제품 사진</Typography>
                    <Button
                      size="small"
                      onClick={() => handleAutoFill()}
                      disabled={isAnalyzing || isDragMode}
                      sx={{
                        borderRadius: 20,
                        padding: "2px 8px",
                        color: "white",
                        backgroundColor: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "&:disabled": {
                          backgroundColor: "grey.400",
                        },
                        display:
                          form.images.length > 0 ? "inline-flex" : "none",
                      }}
                    >
                      {isAnalyzing ? (
                        <>
                          <CircularProgress
                            size={14}
                            sx={{ mr: 1, color: "white" }}
                          />
                          분석 중...
                        </>
                      ) : isSelectingImage ? (
                        "사진을 선택해주세요"
                      ) : (
                        "AI로 자동 채우기"
                      )}
                    </Button>
                  </Box>

                  {isSelectingImage && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsSelectingImage(false);
                        setSelectedAnalysisImage(null);
                      }}
                      sx={{
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: "12px",
                        minWidth: "auto",
                        color: "error.main",
                        borderColor: "error.main",
                        "&:hover": {
                          borderColor: "error.dark",
                          backgroundColor: "error.light",
                        },
                      }}
                    >
                      취소
                    </Button>
                  )}

                  {form.images.length > 1 && !isSelectingImage && (
                    <Button
                      size="small"
                      variant={isDragMode ? "contained" : "outlined"}
                      onClick={() => setIsDragMode(!isDragMode)}
                      sx={{
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: "12px",
                        minWidth: "auto",
                      }}
                    >
                      {isDragMode ? "완료" : "순서 변경"}
                    </Button>
                  )}
                </Box>
                <DndContext
                  sensors={isDragMode ? sensors : []} // 드래그 모드일 때만 센서 활성화
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  autoScroll={false} // 자동 스크롤 비활성화
                >
                  <SortableContext
                    items={form.images.map((_, index) => `image-${index}`)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {form.images.map((image, index) => (
                        <SortableImageItem
                          key={`image-${index}`}
                          id={`image-${index}`}
                          image={image}
                          index={index}
                          onDelete={handleImageDelete}
                          onImageClick={handleImageClick}
                          isDragMode={isDragMode}
                          isSelectingImage={isSelectingImage}
                          isSelectedForAnalysis={
                            selectedAnalysisImage === index
                          }
                        />
                      ))}
                      {form.images.length < 5 && (
                        <Button
                          component="label"
                          variant="outlined"
                          sx={{
                            width: 100,
                            height: 100,
                            borderStyle: "dashed",
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageUpload}
                            multiple
                          />
                          <AddPhotoAlternateIcon />
                        </Button>
                      )}
                    </Box>
                  </SortableContext>
                </DndContext>
              </Box>
            )}

            {/* 판매일 때만 추가 정보 표시 */}
            {form.tradeType === "sell" && form.images.length > 0 && (
              <>
                {/* 카테고리 */}
                <FormControl fullWidth required>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    label="카테고리"
                    onChange={handleSelectChange}
                    disabled={isAnalyzing}
                  >
                    <MenuItem value="REFRIGERATOR">냉장고</MenuItem>
                    <MenuItem value="WASHING_MACHINE">세탁기</MenuItem>
                    <MenuItem value="AIR_CONDITIONER">에어컨</MenuItem>
                  </Select>
                </FormControl>

                {/* 모델명 */}
                {isAnalyzing ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <TextField
                    label="모델명"
                    name="modelName"
                    value={form.modelName}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{
                      textDecoration:
                        autoFilled && autoFilledFields.has("modelName")
                          ? "underline"
                          : "none",
                      color:
                        autoFilled && autoFilledFields.has("modelName")
                          ? "primary.main"
                          : "text.primary",
                    }}
                  />
                )}

                {/* 브랜드 */}
                {isAnalyzing ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <TextField
                    label="브랜드"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{
                      textDecoration:
                        autoFilled && autoFilledFields.has("brand")
                          ? "underline"
                          : "none",
                      color:
                        autoFilled && autoFilledFields.has("brand")
                          ? "primary.main"
                          : "text.primary",
                    }}
                  />
                )}

                {/* 가격 */}
                {isAnalyzing ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <TextField
                    label="판매가"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                    sx={{
                      textDecoration:
                        autoFilled && autoFilledFields.has("price")
                          ? "underline"
                          : "none",
                      color:
                        autoFilled && autoFilledFields.has("price")
                          ? "primary.main"
                          : "text.primary",
                    }}
                  />
                )}

                {/* 희망가 */}
                {/* <TextField
                  label="희망가"
                  name="userPrice"
                  value={form.userPrice}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                /> */}

                {/* 상세 설명 */}
                {isAnalyzing ? (
                  <Skeleton variant="rectangular" height={140} />
                ) : (
                  <TextField
                    label="상세 설명"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={5}
                    required
                    sx={{
                      textDecoration:
                        autoFilled && autoFilledFields.has("description")
                          ? "underline"
                          : "none",
                      color:
                        autoFilled && autoFilledFields.has("description")
                          ? "primary.main"
                          : "text.primary",
                    }}
                  />
                )}
              </>
            )}

            {/* 카테고리가 선택되었을 때만 제품 상태 확인 표시 */}
            {form.tradeType === "sell" &&
              form.category &&
              questions.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    제품 상태 확인
                  </Typography>
                  <Stack spacing={2}>
                    {isAnalyzing
                      ? // 로딩 중일 때 스켈레톤 표시
                        Array.from({ length: 3 }).map((_, index) => (
                          <Box key={index}>
                            <Skeleton
                              variant="text"
                              width="60%"
                              height={24}
                              sx={{ mb: 1 }}
                            />
                            <Skeleton variant="rectangular" height={56} />
                          </Box>
                        ))
                      : questions.map((question) => (
                          <Box key={question.id}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {question.questionContent}
                            </Typography>
                            <TextField
                              value={
                                form.defectAnswers[question.questionContent] ||
                                ""
                              }
                              onChange={(e) =>
                                handleDefectQuestionChange(
                                  question.questionContent,
                                  e.target.value
                                )
                              }
                              fullWidth
                              required
                              placeholder="답변을 입력해주세요"
                            />
                          </Box>
                        ))}
                  </Stack>
                </Box>
              )}

            {/* 구매일 때만 수량 표시 */}
            {form.tradeType === "buy" && (
              <>
                {/* 카테고리 */}
                <FormControl fullWidth required>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    label="카테고리"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="REFRIGERATOR">냉장고</MenuItem>
                    <MenuItem value="WASHING_MACHINE">세탁기</MenuItem>
                    <MenuItem value="AIR_CONDITIONER">에어컨</MenuItem>
                  </Select>
                </FormControl>

                {/* 구매글 기본 이미지 표시 */}
                {form.images.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      overflow: "hidden",
                      mb: 2,
                    }}
                  >
                    <img
                      src={form.images[0]}
                      alt="기본 이미지"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}

                <TextField
                  label="수량"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
                <TextField
                  label="상세 설명"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </>
            )}

            {/* 등록 버튼 */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={
                isAnalyzing ||
                isSubmitting ||
                !form.title ||
                !form.tradeType ||
                !form.category ||
                (form.tradeType === "sell" && form.images.length === 0) ||
                !form.description
              }
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                  등록 중...
                </>
              ) : (
                "등록"
              )}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* 이미지 뷰어 다이얼로그 */}
      <Dialog
        open={imageViewerOpen}
        onClose={handleCloseImageViewer}
        maxWidth={false}
        fullScreen
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0, 0, 0, 0.9)",
          },
        }}
        disableEscapeKeyDown={false} // ESC 키로 닫기 활성화
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            p: 0,
            height: "100vh",
            overflow: "hidden",
          }}
          onClick={(e) => {
            // DialogContent 자체를 클릭하면 닫기 (이미지 외부 영역)
            if (e.target === e.currentTarget) {
              handleCloseImageViewer();
            }
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleCloseImageViewer}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* 이미지 카운터 */}
          {selectedImageIndex !== null && (
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "4px 8px",
                borderRadius: 1,
              }}
            >
              {selectedImageIndex + 1} / {form.images.length}
            </Typography>
          )}

          {/* 이전 이미지 버튼 */}
          {selectedImageIndex !== null && selectedImageIndex > 0 && (
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.7)",
                },
              }}
            >
              <ArrowLeftIcon />
            </IconButton>
          )}

          {/* 다음 이미지 버튼 */}
          {selectedImageIndex !== null &&
            selectedImageIndex < form.images.length - 1 && (
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            )}

          {/* 메인 이미지 */}
          {selectedImageIndex !== null && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: zoom > 1 ? "grab" : "zoom-in",
                "&:active": {
                  cursor: zoom > 1 ? "grabbing" : "zoom-in",
                },
              }}
              onClick={(e) => {
                if (e.detail === 2) {
                  // Double click
                  setZoom(zoom === 1 ? 2 : 1);
                }
              }}
            >
              <img
                src={form.images[selectedImageIndex]}
                alt={`상품 사진 ${selectedImageIndex + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </Box>
          )}

          {/* 컨트롤 버튼들 */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              zIndex: 10,
            }}
          >
            <Fab
              size="small"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              <ZoomOutIcon />
            </Fab>

            <Fab
              size="small"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              <ZoomInIcon />
            </Fab>

            <Fab
              size="small"
              onClick={handleRotate}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <RotateRightIcon />
            </Fab>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PostCreate;
