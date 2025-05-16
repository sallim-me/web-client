import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Paper,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostCard from '../../../components/PostCard';

// 임시 데이터 타입 정의
interface Post {
  id: number;
  title: string;
  modelName: string;
  price: number;
  imageUrl: string;
  isScraped: boolean;
  category: string;
  status: 'available' | 'sold';
  author?: string;
  authorId?: string;
  isAuthor?: boolean;
  type?: 'sell' | 'buy';
  specifications?: string;
  defectQuestions?: {
    cooling: string;
    noise: string;
    exterior: string;
  };
}

interface StatusOption {
  value: 'all' | 'available' | 'sold';
  label: string;
}

const PostList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'sold'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const categories = ['냉장고', '에어컨', '세탁기'];
  const statusOptions: StatusOption[] = [
    { value: 'all', label: '전체 상태' },
    { value: 'available', label: '판매중' },
    { value: 'sold', label: '판매완료' },
  ];

  // 초기 게시물 데이터
  const initialPosts: Post[] = [
    {
      id: 1,
      title: '[판매] 삼성 냉장고 팝니다',
      modelName: 'RM70F90',
      price: 500000,
      imageUrl: `${process.env.PUBLIC_URL}/images/refrigerator.svg`,
      isScraped: false,
      category: '냉장고',
      status: 'available',
    },
    {
      id: 2,
      title: '[판매] LG 통돌이 세탁기 급처',
      modelName: 'CAE7895SI',
      price: 150000,
      imageUrl: `${process.env.PUBLIC_URL}/images/washer.svg`,
      isScraped: true,
      category: '세탁기',
      status: 'available',
    },
    // ... 나머지 초기 데이터
  ];

  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('posts');
    const parsedPosts = savedPosts ? JSON.parse(savedPosts) : initialPosts;

    return parsedPosts.map((post: Post) => ({
      ...post,
      author: post.author || '현재 사용자',
      authorId: post.authorId || 'current-user',
      isAuthor: post.isAuthor ?? true,
      type: post.type || 'sell',
      status: post.status || 'available',
      specifications: post.specifications || '',
      defectQuestions: post.defectQuestions || {
        cooling: '정상',
        noise: '정상',
        exterior: '정상',
      },
    }));
  });

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handleScrap = (postId: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, isScraped: !post.isScraped } : post
    );
    setPosts(updatedPosts);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(post.category);
    const statusMatch =
      selectedStatus === 'all' || post.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box sx={{ pb: '76px' }}>
      <Container maxWidth="sm" sx={{ px: 1.5, py: 1.5 }}>
        <Stack spacing={1.5}>
          {/* 카테고리 필터 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? 'contained' : 'outlined'}
                size="small"
                onClick={() => toggleCategory(category)}
                sx={{
                  borderRadius: '16px',
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.75,
                  fontSize: '13px',
                  borderColor: 'primary.main',
                  color: selectedCategories.includes(category) ? 'white' : 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: selectedCategories.includes(category) ? 'white' : 'primary.main',
                  },
                }}
              >
                {category}
              </Button>
            ))}
          </Box>

          <Divider />

          {/* 상태 필터 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedStatus === option.value ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSelectedStatus(option.value)}
                sx={{
                  borderRadius: '16px',
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.75,
                  fontSize: '13px',
                  borderColor: 'primary.main',
                  color: selectedStatus === option.value ? 'white' : 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: selectedStatus === option.value ? 'white' : 'primary.main',
                  },
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Stack>

        {/* 게시물 그리드 */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {currentPosts.map((post) => (
            <Grid item xs={6} key={post.id}>
              <PostCard
                {...post}
                modelName={post.modelName}
                imageUrl={post.imageUrl}
                onScrapClick={() => handleScrap(post.id)}
                onClick={() => navigate(`/post/detail/${post.id}`)}
              />
            </Grid>
          ))}
        </Grid>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handlePageChange(page)}
                sx={{ mx: 0.5 }}
              >
                {page}
              </Button>
            ))}
          </Box>
        )}

        {/* 추가 버튼 */}
        <IconButton
          onClick={() => navigate('/post/create')}
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 76,
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            boxShadow: 2,
          }}
        >
          <AddIcon />
        </IconButton>
      </Container>
    </Box>
  );
};

export default PostList; 