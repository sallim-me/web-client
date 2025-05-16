import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';

// 타입 정의
interface Post {
  id: number;
  title: string;
  author: string;
  authorId: string;
  isAuthor: boolean;
  type: 'sell' | 'buy';
  status: 'available' | 'sold';
  category: string;
  images: string[];
  modelName: string;
  specifications: string;
  defectAnswers: Record<string, string>;
  description: string;
  price: number;
  isScraped: boolean;
  createdAt: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

const PostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Mock data - 실제로는 API에서 받아와야 함
  const savedPosts = localStorage.getItem('posts');
  const posts = savedPosts ? JSON.parse(savedPosts) : [];
  const post = posts.find((p: Post) => p.id === Number(id)) || {
    id: Number(id),
    title: '게시물을 찾을 수 없습니다',
    author: '알 수 없음',
    authorId: 'unknown',
    isAuthor: false,
    type: 'sell',
    status: 'available',
    category: '알 수 없음',
    images: [],
    modelName: '알 수 없음',
    specifications: '알 수 없음',
    defectAnswers: {
      cooling: '알 수 없음',
      noise: '알 수 없음',
      exterior: '알 수 없음',
    },
    description: '해당 게시물을 찾을 수 없습니다.',
    price: 0,
    isScraped: false,
    createdAt: new Date().toISOString(),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isScraped, setIsScraped] = useState(post.isScraped || false);

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

  const profileColor = useMemo(() => getRandomColor(), []);
  const initial = post?.author ? post.author.charAt(0) : '?';

  const handleScrap = () => {
    const updatedPosts = posts.map((p: Post) =>
      p.id === Number(id) ? { ...p, isScraped: !p.isScraped } : p
    );
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setIsScraped(!isScraped);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && comment.length <= 1000) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          author: '현재 사용자',
          content: comment,
          createdAt: new Date().toISOString(),
        },
      ]);
      setComment('');
    }
  };

  const handleCommentDelete = (commentId: number) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  return (
    <Container maxWidth="sm" sx={{ pb: '76px' }}>
      {/* 헤더 */}
      <Paper
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          mb: 2,
        }}
      >
        <IconButton onClick={handleBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {post.title}
        </Typography>
        <IconButton onClick={handleScrap} size="small">
          {isScraped ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
        </IconButton>
      </Paper>

      <Stack spacing={3}>
        {/* 이미지 섹션 */}
        <Paper
          sx={{
            width: '100%',
            height: 300,
            bgcolor: 'grey.100',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          {/* 이미지 캐러셀은 추후 추가 */}
        </Paper>

        {/* 정보 섹션 */}
        <Stack spacing={3}>
          {/* 가격 */}
          <Paper sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">가격</Typography>
              <Typography variant="h6" color="primary">
                {post.price.toLocaleString()}원
              </Typography>
            </Stack>
          </Paper>

          {/* 작성자 정보 */}
          <Paper sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: profileColor,
                    width: 40,
                    height: 40,
                  }}
                >
                  {initial}
                </Avatar>
                <Typography>{post.author}</Typography>
              </Stack>
              <Button
                variant="contained"
                onClick={() => navigate(`/chat/${post.authorId}`)}
              >
                채팅하기
              </Button>
            </Stack>
          </Paper>

          {/* 제품 정보 */}
          {post.specifications && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                제품 정보
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.specifications}
              </Typography>
            </Paper>
          )}

          {/* 상태 정보 */}
          {post.defectAnswers && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                상태 정보
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(post.defectAnswers).map(([key, value]) => (
                  <Grid item xs={4} key={key}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {key === 'cooling'
                          ? '냉각 기능'
                          : key === 'noise'
                          ? '소음'
                          : '외관'}
                      </Typography>
                      <Typography variant="body2">
                        {String(value)}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* 상세 설명 */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              상세 설명
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.description}
            </Typography>
          </Paper>
        </Stack>

        {/* 댓글 섹션 */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            댓글
          </Typography>
          <Box
            component="form"
            onSubmit={handleCommentSubmit}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요 (최대 1000자)"
                inputProps={{ maxLength: 1000 }}
                size="small"
              />
              <Button type="submit" variant="contained">
                등록
              </Button>
            </Stack>
          </Box>
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Box key={comment.id}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2">
                      {comment.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  {comment.author === '현재 사용자' && (
                    <IconButton
                      size="small"
                      onClick={() => handleCommentDelete(comment.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {comment.content}
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default PostDetail; 