import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Stack,
  Paper,
  IconButton,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// 타입 정의
interface Post {
  id: number;
  title: string;
  price: number;
  isAuthor: boolean;
  isScraped: boolean;
}

const MyPage = () => {
  const navigate = useNavigate();

  // 예시 유저 정보
  const nickname = 'HGD';
  const userName = '홍길동';

  // 실제 글 데이터 불러오기
  const savedPosts = localStorage.getItem('posts');
  const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
  const myPosts = posts.filter((post) => post.isAuthor);
  const scrappedPosts = posts.filter((post) => post.isScraped);

  const getRandomColor = () => {
    const colors = [
      '#FF9AA2',
      '#FFB7B2',
      '#FFDAC1',
      '#E2F0CB',
      '#B5EAD7',
      '#C7CEEA',
      '#9FB3DF',
      '#B8B3E9',
      '#D4A5A5',
      '#9CADCE',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Container maxWidth="sm" sx={{ pb: '76px' }}>
      {/* 헤더 */}
      <Paper
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          p: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" align="center">
          마이페이지
        </Typography>
      </Paper>

      {/* 프로필 섹션 */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: getRandomColor(),
              fontSize: 24,
            }}
          >
            {nickname.charAt(0)}
          </Avatar>
          <Stack spacing={0.5}>
            <Typography variant="h6">{userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              닉네임: {nickname}
            </Typography>
          </Stack>
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            sx={{ width: '60%' }}
            onClick={() => navigate('/my-page/edit-profile')}
          >
            회원 정보 수정
          </Button>
        </Box>
      </Paper>

      {/* 내가 쓴 글 */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            내가 쓴 글
          </Typography>
          <IconButton
            onClick={() => navigate('/my-page/my-posts')}
            size="small"
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 2,
            },
          }}
        >
          {myPosts.map((post) => (
            <Paper
              key={post.id}
              onClick={() => navigate(`/post/detail/${post.id}`)}
              sx={{
                flexShrink: 0,
                width: 140,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={{
                  height: 70,
                  bgcolor: 'grey.200',
                  borderRadius: '8px 8px 0 0',
                }}
              />
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ mb: 0.5 }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  fontWeight="bold"
                >
                  ₩{post.price.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* 스크랩한 글 */}
      <Box sx={{ px: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            스크랩한 글
          </Typography>
          <IconButton
            onClick={() => navigate('/my-page/scrapped')}
            size="small"
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 2,
            },
          }}
        >
          {scrappedPosts.map((post) => (
            <Paper
              key={post.id}
              onClick={() => navigate(`/post/detail/${post.id}`)}
              sx={{
                flexShrink: 0,
                width: 140,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={{
                  height: 70,
                  bgcolor: 'grey.200',
                  borderRadius: '8px 8px 0 0',
                }}
              />
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ mb: 0.5 }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  fontWeight="bold"
                >
                  ₩{post.price.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default MyPage; 