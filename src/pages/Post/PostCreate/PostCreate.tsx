import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  createBuyingPost,
  createSellingPost,
  getApplianceQuestions,
  analyzeImage,
} from "../../../api/product";
import { useAuthStore } from "../../../store/useAuthStore";

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
  images: string[];
  defectAnswers: Record<string, string>;
}

interface ApplianceQuestion {
  id: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  questionContent: string;
}

const PostCreate = () => {
  const navigate = useNavigate();
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
    defectAnswers: {},
  });
  const [questions, setQuestions] = useState<ApplianceQuestion[]>([]);
  const [autoFilled, setAutofilled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (form.tradeType === "buy") {
        const userProfile = useAuthStore.getState().userProfile;
        console.log("Submitting as buyer, user profile:", userProfile);

        if (!userProfile?.isBuyer) {
          alert("바이어로 등록된 사용자만 구매글을 작성할 수 있습니다.");
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
        await createBuyingPost(data);
      } else {
        const userProfile = useAuthStore.getState().userProfile;
        if (!userProfile) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        // 판매글 작성
        const answers = questions.map((question) => ({
          questionId: question.id,
          answerContent: form.defectAnswers[question.questionContent] || "",
        }));

        const data = {
          title: form.title,
          content: form.description,
          applianceType: form.category.toUpperCase() as
            | "REFRIGERATOR"
            | "WASHING_MACHINE"
            | "AIR_CONDITIONER",
          modelNumber: form.modelNumber,
          modelName: form.modelName,
          brand: form.brand,
          price: parseInt(form.price),
          userPrice: parseInt(form.userPrice),
          answers,
        };

        console.log("Submitting selling post data:", data);
        await createSellingPost(data);
      }

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시글 작성에 실패했습니다.");
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
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("질문을 불러오는데 실패했습니다.");
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "category" ? value.toUpperCase() : value,
    }));
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
    }));
  };

  const handleImageDelete = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
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

  const handleAutoFill = async () => {
    if (form.images.length === 0) {
      alert("분석할 이미지를 먼저 업로드해주세요.");
      return;
    }

    setIsAnalyzing(true);
    try {
      // 첫 번째 이미지를 File 객체로 변환
      const imageUrl = form.images[0];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      const result = await analyzeImage(file);
      
      if (result.success) {
        // 자동완성된 필드들을 추적
        const filledFields = new Set<string>();
        
        setForm((prev) => {
          const newForm = { ...prev };
          
          if (result.title) {
            newForm.title = result.title;
            filledFields.add('title');
          }
          if (result.category) {
            newForm.category = result.category;
            filledFields.add('category');
          }
          if (result.model_code) {
            newForm.modelName = result.model_code;
            filledFields.add('modelName');
          }
          if (result.brand) {
            newForm.brand = result.brand;
            filledFields.add('brand');
          }
          if (result.price) {
            newForm.price = result.price.toString();
            filledFields.add('price');
          }
          if (result.description) {
            newForm.description = result.description;
            filledFields.add('description');
          }
          
          return newForm;
        });
        
        setAutoFilledFields(filledFields);
        setAutofilled(true);

        // 카테고리가 변경되었으므로 질문들도 다시 불러오기
        try {
          const questionsResponse = await getApplianceQuestions(result.category);
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
    // 모든 필수 필드가 채워져 있는지 확인
    if (!form.title || !form.tradeType || !form.category || !form.description) {
      alert("모든 필수 항목을 입력해주세요.");
      return false;
    }

    // 구매 글일 경우 수량이 3 이상인지 확인
    if (form.tradeType === "buy") {
      const quantity = parseInt(form.quantity);
      if (isNaN(quantity) || quantity < 3) {
        alert("수량은 3 이상이어야 합니다.");
        return false;
      }
    }

    return true;
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
        <Stack direction="row" alignItems="center" spacing={0} sx={{ mr: "32px" }}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
            글 작성
          </Typography>
        </Stack>
      </Paper>

      {/* 글 작성 폼 */}
      <Paper sx={{ 
        p: 3,
        boxShadow: "none",
      }}>
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
                  textDecoration: autoFilled && autoFilledFields.has('title') ? "underline" : "none",
                  color: autoFilled && autoFilledFields.has('title') ? "primary.main" : "text.primary",
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
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: 1 }}>
                  <Typography variant="h6">
                    제품 사진
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleAutoFill}
                    disabled={isAnalyzing}
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
                      display: form.images.length > 0 ? "inline-flex" : "none",
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <CircularProgress size={14} sx={{ mr: 1, color: "white" }} />
                        분석 중...
                      </>
                    ) : (
                      "AI로 자동 채우기"
                    )}
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {form.images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                      }}
                    >
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleImageDelete(index)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "background.paper",
                          "&:hover": {
                            bgcolor: "background.paper",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
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
                      textDecoration: autoFilled && autoFilledFields.has('modelName') ? "underline" : "none",
                      color: autoFilled && autoFilledFields.has('modelName') ? "primary.main" : "text.primary",
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
                      textDecoration: autoFilled && autoFilledFields.has('brand') ? "underline" : "none",
                      color: autoFilled && autoFilledFields.has('brand') ? "primary.main" : "text.primary",
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
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                    sx={{
                      textDecoration: autoFilled && autoFilledFields.has('price') ? "underline" : "none",
                      color: autoFilled && autoFilledFields.has('price') ? "primary.main" : "text.primary",
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
                      textDecoration: autoFilled && autoFilledFields.has('description') ? "underline" : "none",
                      color: autoFilled && autoFilledFields.has('description') ? "primary.main" : "text.primary",
                    }}
                  />
                )}
              </>
            )}

                {/* 카테고리가 선택되었을 때만 제품 상태 확인 표시 */}
                {form.category && questions.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      제품 상태 확인
                    </Typography>
                    <Stack spacing={2}>
                      {isAnalyzing ? (
                        // 로딩 중일 때 스켈레톤 표시
                        Array.from({ length: 3 }).map((_, index) => (
                          <Box key={index}>
                            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" height={56} />
                          </Box>
                        ))
                      ) : (
                        questions.map((question) => (
                          <Box key={question.id}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {question.questionContent}
                            </Typography>
                            <TextField
                              value={
                                form.defectAnswers[question.questionContent] || ""
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
                        ))
                      )}
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

                <TextField
                  label="수량"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                  InputProps={{
                    inputProps: { min: 3 },
                  }}
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
                !form.title ||
                !form.tradeType ||
                !form.category ||
                (form.tradeType === "sell" && form.images.length === 0) ||
                !form.description
              }
            >
              등록
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default PostCreate;
