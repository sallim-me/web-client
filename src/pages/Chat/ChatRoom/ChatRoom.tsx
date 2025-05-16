import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Paper,
  TextField,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// 타입 정의
interface Message {
  id: number;
  content: string;
  time: string;
  isMine: boolean;
}

interface MessageGroup {
  id: number;
  date: string;
  items: Message[];
}

interface PostInfo {
  id: string;
  title: string;
}

const ChatRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // 더미 데이터 - 실제로는 API에서 받아와야 함
  const postInfo: PostInfo = {
    id: 'post123',
    title: '맥북 프로 M1 2020 13인치 판매합니다',
  };

  const messages: MessageGroup[] = [
    {
      id: 1,
      date: '2024년 3월 15일',
      items: [
        {
          id: 1,
          content: '안녕하세요! 상품 아직 있나요?',
          time: '14:30',
          isMine: false,
        },
        {
          id: 2,
          content: '네, 아직 있습니다!',
          time: '14:31',
          isMine: true,
        },
      ],
    },
    {
      id: 2,
      date: '2024년 3월 16일',
      items: [
        {
          id: 3,
          content: '가격은 얼마인가요?',
          time: '10:15',
          isMine: false,
        },
        {
          id: 4,
          content: '50만원입니다. 협의 가능합니다.',
          time: '10:20',
          isMine: true,
        },
        {
          id: 5,
          content: '직거래 가능한가요?',
          time: '10:25',
          isMine: false,
        },
      ],
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handlePostClick = () => {
    navigate(`/posts/${postInfo.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: 메시지 전송 로직 구현
      setMessage('');
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 0,
      }}
    >
      {/* 헤더 */}
      <Paper
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            onClick={handleBack}
            sx={{ color: 'white' }}
            size="small"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box
            onClick={handlePostClick}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              cursor: 'pointer',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {postInfo.title}
            </Typography>
            <ArrowForwardIcon fontSize="small" />
          </Box>
        </Stack>
      </Paper>

      {/* 채팅 영역 */}
      <Box
        ref={chatAreaRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((group) => (
          <Box key={group.id}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {group.date}
              </Typography>
            </Divider>
            <Stack spacing={1}>
              {group.items.map((msg) => (
                <Stack
                  key={msg.id}
                  direction="row"
                  spacing={1}
                  alignItems="flex-end"
                  sx={{
                    flexDirection: msg.isMine ? 'row-reverse' : 'row',
                  }}
                >
                  {!msg.isMine && (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'grey.300',
                      }}
                    />
                  )}
                  <Stack
                    spacing={0.5}
                    sx={{
                      maxWidth: '70%',
                      alignItems: msg.isMine ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: msg.isMine ? 'primary.main' : 'grey.100',
                        color: msg.isMine ? 'white' : 'text.primary',
                        borderRadius: 2,
                        borderBottomRightRadius: msg.isMine ? 0 : 2,
                        borderBottomLeftRadius: msg.isMine ? 2 : 0,
                      }}
                    >
                      <Typography variant="body2">{msg.content}</Typography>
                    </Paper>
                    <Typography variant="caption" color="text.secondary">
                      {msg.time}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>

      {/* 입력 영역 */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
              },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ChatRoom; 