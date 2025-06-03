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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createBuyingPost } from "../../../api/product";
import { memberApi } from "../../../api/member";
import { useAuthStore } from "../../../store/useAuthStore";

interface PostForm {
  title: string;
  tradeType: string;
  category: string;
  modelNumber: string;
  modelName: string;
  brand: string;
  minPrice: string;
  description: string;
  quantity: string;
  images: string[];
  defectAnswers: Record<string, string>;
}

interface DefectQuestions {
  [key: string]: string[];
}

const PostCreate = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuthStore();
  const [form, setForm] = useState<PostForm>({
    title: "",
    tradeType: "",
    category: "",
    modelNumber: "",
    modelName: "",
    brand: "",
    minPrice: "",
    description: "",
    quantity: "",
    images: [],
    defectAnswers: {},
  });

  const defectQuestions: DefectQuestions = {
    refrigerator: [
      "냉각 기능에 문제가 있나요?",
      "문이 제대로 닫히나요?",
      "내부 부품이 모두 있나요?",
    ],
    washer: [
      "세탁 기능에 문제가 있나요?",
      "배수가 잘 되나요?",
      "소음이 심한가요?",
    ],
    aircon: [
      "냉방 기능에 문제가 있나요?",
      "실외기 상태는 어떤가요?",
      "필터 상태는 어떤가요?",
    ],
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 방지
    if (!validateForm()) return;

    try {
      if (form.tradeType === "buy") {
        const response = await createBuyingPost({
          title: form.title,
          content: form.description,
          quantity: parseInt(form.quantity),
          applianceType: form.category as
            | "REFRIGERATOR"
            | "WASHING_MACHINE"
            | "AIR_CONDITIONER",
          price: parseInt(form.minPrice),
        });

        if (response.status === 200) {
          alert("글 작성에 성공했습니다."); // 성공 메시지 추가
          navigate("/post/list");
        } else {
          alert("글 작성에 실패했습니다.");
        }
      } else {
        // 판매 글 작성 API는 아직 연결되지 않음
        alert("판매 글 작성 기능은 아직 준비 중입니다.");
      }
    } catch (error) {
      console.error("글 작성 중 오류 발생:", error);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = async (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    if (name === "tradeType" && value === "buy") {
      if (!userProfile) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      if (!userProfile.isBuyer) {
        alert("바이어로 등록된 사용자만 구매글을 작성할 수 있습니다.");
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
            글 작성
          </Typography>
        </Stack>
      </Paper>

      {/* 글 작성 폼 */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 제목 */}
            <TextField
              label="제목"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* 거래 유형 */}
            <FormControl fullWidth required>
              <InputLabel>거래 유형</InputLabel>
              <Select
                name="tradeType"
                value={form.tradeType}
                label="거래 유형"
                onChange={handleSelectChange}
              >
                <MenuItem value="sell">판매</MenuItem>
                <MenuItem value="buy">구매</MenuItem>
              </Select>
            </FormControl>

            {/* 판매일 때만 이미지 업로드 표시 */}
            {form.tradeType === "sell" && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  제품 사진
                </Typography>
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
                  >
                    <MenuItem value="refrigerator">냉장고</MenuItem>
                    <MenuItem value="washer">세탁기</MenuItem>
                    <MenuItem value="aircon">에어컨</MenuItem>
                  </Select>
                </FormControl>

                {/* 모델 번호 */}
                <TextField
                  label="모델 번호"
                  name="modelNumber"
                  value={form.modelNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                {/* 모델명 */}
                <TextField
                  label="모델명"
                  name="modelName"
                  value={form.modelName}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                {/* 브랜드 */}
                <TextField
                  label="브랜드"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                {/* 최저가 */}
                <TextField
                  label="최저가"
                  name="minPrice"
                  value={form.minPrice}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />

                {/* 카테고리가 선택되었을 때만 제품 상태 확인 표시 */}
                {form.category && defectQuestions[form.category] && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      제품 상태 확인
                    </Typography>
                    <Stack spacing={2}>
                      {defectQuestions[form.category].map((question) => (
                        <TextField
                          key={question}
                          label={question}
                          value={form.defectAnswers[question] || ""}
                          onChange={(e) =>
                            handleDefectQuestionChange(question, e.target.value)
                          }
                          fullWidth
                          required
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* 상세 설명 */}
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
                    <MenuItem value="refrigerator">냉장고</MenuItem>
                    <MenuItem value="washer">세탁기</MenuItem>
                    <MenuItem value="aircon">에어컨</MenuItem>
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
