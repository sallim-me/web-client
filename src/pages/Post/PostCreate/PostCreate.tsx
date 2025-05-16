import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// 타입 정의
interface FormData {
  title: string;
  tradeType: string;
  category: string;
  images: string[];
  modelName: string;
  specifications: string;
  defectAnswers: Record<string, string>;
  description: string;
  price: string;
}

interface DefectQuestions {
  [key: string]: string[];
}

const PostCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    tradeType: '',
    category: '',
    images: [],
    modelName: '',
    specifications: '',
    defectAnswers: {},
    description: '',
    price: '',
  });

  const categories = ['냉장고', '세탁기', '에어컨'];
  const tradeTypes = ['판매', '구매'];

  const defectQuestions: DefectQuestions = {
    냉장고: [
      '냉각 기능에 문제가 있나요?',
      '문이 제대로 닫히나요?',
      '내부 부품이 모두 있나요?',
    ],
    세탁기: [
      '세탁 기능에 문제가 있나요?',
      '배수가 잘 되나요?',
      '소음이 심한가요?',
    ],
    에어컨: [
      '냉방 기능에 문제가 있나요?',
      '실외기 상태는 어떤가요?',
      '필터 상태는 어떤가요?',
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDefectQuestionChange = (question: string, answer: string) => {
    setFormData((prev) => ({
      ...prev,
      defectAnswers: {
        ...prev.defectAnswers,
        [question]: answer,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert('최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleImageDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const getImageForCategory = (category: string) => {
    switch (category) {
      case '냉장고':
        return '/images/refrigerator.svg';
      case '세탁기':
        return '/images/washer.svg';
      case '에어컨':
        return '/images/airconditioner.svg';
      default:
        return '/images/refrigerator.svg';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 기존 게시물 가져오기
    const savedPosts = localStorage.getItem('posts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];

    // 새 게시물 데이터 생성
    const newPost = {
      id: Date.now(),
      title: `[${formData.tradeType}] ${formData.title}`,
      modelName: formData.modelName,
      price: Number(formData.price),
      imageUrl: getImageForCategory(formData.category),
      isScraped: false,
      category: formData.category,
      status: 'available',
      author: '현재 사용자',
      authorId: 'current-user',
      isAuthor: true,
      type: formData.tradeType === '판매' ? 'sell' : 'buy',
      specifications: formData.specifications,
      defectAnswers: formData.defectAnswers,
      description: formData.description,
      createdAt: new Date().toISOString(),
    };

    // 새 게시물을 기존 게시물 배열에 추가
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // 게시물 목록 페이지로 이동
    navigate('/post/list');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <TextField
          label="제목"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="브랜드명, 제품명, 모델명을 포함해주세요"
          required
          fullWidth
        />

        <FormControl fullWidth required>
          <InputLabel>거래 유형</InputLabel>
          <Select
            name="tradeType"
            value={formData.tradeType}
            onChange={handleSelectChange}
            label="거래 유형"
          >
            {tradeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formData.tradeType && (
          <>
            <FormControl fullWidth required>
              <InputLabel>카테고리</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleSelectChange}
                label="카테고리"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.tradeType === '판매' && (
              <>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    제품 사진 (최대 5장)
                  </Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{ width: '100%', height: 120 }}
                  >
                    클릭하여 사진 업로드
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </Button>
                  {formData.images.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mt: 2,
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': {
                          height: 6,
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#f5f5f5',
                          borderRadius: 3,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#bddde4',
                          borderRadius: 3,
                        },
                      }}
                    >
                      {formData.images.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleImageDelete(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'background.paper',
                              '&:hover': {
                                bgcolor: 'background.paper',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>

                <TextField
                  label="모델명"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  label="제품 사양"
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                />

                <TextField
                  label="가격"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: <Typography>원</Typography>,
                  }}
                />

                {formData.category && defectQuestions[formData.category] && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      제품 상태 확인
                    </Typography>
                    {defectQuestions[formData.category].map((question) => (
                      <FormControl key={question} component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">{question}</FormLabel>
                        <RadioGroup
                          value={formData.defectAnswers[question] || ''}
                          onChange={(e) => handleDefectQuestionChange(question, e.target.value)}
                        >
                          <FormControlLabel value="정상" control={<Radio />} label="정상" />
                          <FormControlLabel value="불량" control={<Radio />} label="불량" />
                        </RadioGroup>
                      </FormControl>
                    ))}
                  </Box>
                )}

                <TextField
                  label="상세 설명"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                />
              </>
            )}
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={!formData.title || !formData.tradeType || !formData.category}
        >
          등록하기
        </Button>
      </Paper>
    </Container>
  );
};

export default PostCreate; 