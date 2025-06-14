import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Skeleton,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { 
  chatApi, 
  ChatMessageDTO
} from "@/api/chat";
import { useAuthStore } from "@/store/useAuthStore";

// 확장된 메시지 타입 (UI에서 사용)
interface ExtendedMessage extends ChatMessageDTO {
  isMine?: boolean;
  time?: string;
}

// 날짜별 메시지 그룹
interface MessageGroup {
  id: string;
  date: string;
  items: ExtendedMessage[];
}

const ChatRoom = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageGroup[]>([]);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const userProfile = useAuthStore((state) => state.userProfile);

  // 채팅방 상태 조회
  const { data: chatRoomStatus, isLoading: statusLoading, error: statusError } = useQuery({
    queryKey: ['chatRoomStatus', chatId, userProfile?.memberId],
    queryFn: () => chatApi.getChatRoomStatus(chatId!),
    enabled: !!chatId && !!userProfile?.memberId,
    staleTime: 30000,
    gcTime: 300000
  });

  // 채팅 메시지 조회
  const { data: chatMessages, isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['chatMessages', chatId, userProfile?.memberId],
    queryFn: () => chatApi.getMessages(chatId!),
    enabled: !!chatId && !!userProfile?.memberId,
    staleTime: 10000,
    gcTime: 300000
  });

  // 메시지를 날짜별로 그룹화하고 확장된 형태로 변환
  useEffect(() => {
    if (chatMessages && userProfile) {
      const messages = chatMessages.data || chatMessages; // API 응답 구조에 따라 조정
      const messageArray = Array.isArray(messages) ? messages : [];
      const groupedMessages: { [date: string]: ExtendedMessage[] } = {};
      
      messageArray.forEach((msg: ChatMessageDTO) => {
        const messageDate = new Date(msg.createdAt);
        const dateKey = messageDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        
        const extendedMsg: ExtendedMessage = {
          ...msg,
          isMine: msg.senderId === userProfile.memberId,
          time: messageDate.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        if (!groupedMessages[dateKey]) {
          groupedMessages[dateKey] = [];
        }
        groupedMessages[dateKey].push(extendedMsg);
      });

      const messageGroups: MessageGroup[] = Object.entries(groupedMessages).map(([date, items]) => ({
        id: date,
        date,
        items: items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }));

      setMessages(messageGroups.sort((a, b) => new Date(a.items[0].createdAt).getTime() - new Date(b.items[0].createdAt).getTime()));
    }
  }, [chatMessages, userProfile]);

  // 메시지 전송 뮤테이션
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(chatId!, {
      content: content
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
    onError: (error) => {
      console.error('메시지 전송 실패:', error);
    }
  });

  const handleBack = () => {
    navigate("/chat");
  };

  const handlePostClick = () => {
    // TODO: 실제 상품 ID로 연결
    // navigate(`/post/detail/${productId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
      setMessage("");
    }
  };

  // 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 로딩 상태
  if (statusLoading || messagesLoading) {
    return (
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Stack key={index} direction={index % 2 === 0 ? "row" : "row-reverse"} spacing={1}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 2 }} />
            </Stack>
          ))}
        </Stack>
      </Container>
    );
  }

  // 에러 상태
  if (statusError || messagesError) {
    return (
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Alert severity="error">
          채팅방 정보를 불러오는데 실패했습니다.
        </Alert>
      </Container>
    );
  }

  // 채팅방이 없는 경우
  if (!chatRoomStatus) {
    return (
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Alert severity="info">
          채팅방을 찾을 수 없습니다.
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
    >
      {/* 헤더 */}
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: "primary.main",
          color: "white",
          borderRadius: "0 0 4px 4px",
          p: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack} sx={{ color: "white" }} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box
            onClick={handlePostClick}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              채팅방 #{chatId}
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
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
            }}
          >
            <Typography>채팅을 시작해보세요!</Typography>
          </Box>
        ) : (
          messages.map((group) => (
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
                      flexDirection: msg.isMine ? "row-reverse" : "row",
                    }}
                  >
                    {!msg.isMine && (
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "grey.300",
                        }}
                      >
                        U
                      </Avatar>
                    )}
                    <Stack
                      spacing={0.5}
                      sx={{
                        maxWidth: "70%",
                        alignItems: msg.isMine ? "flex-end" : "flex-start",
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          boxShadow: 0,
                          bgcolor: msg.isMine ? "primary.main" : "grey.200",
                          color: msg.isMine ? "white" : "text.primary",
                          borderRadius: msg.isMine ? "16px 16px 0 16px" : "16px 16px 16px 0",
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
          ))
        )}
      </Box>

      {/* 입력 영역 */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            size="small"
            disabled={sendMessageMutation.isPending}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 20,
              },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!message.trim() || sendMessageMutation.isPending}
            sx={{
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
            <SendIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ChatRoom;
