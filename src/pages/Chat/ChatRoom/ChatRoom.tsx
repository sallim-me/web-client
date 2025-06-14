import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { chatRooms, MessageGroup } from "@/data/chatData";

const ChatRoom = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageGroup[]>([]);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const chatRoom = chatRooms.find((room) => room.id === Number(chatId));

  useEffect(() => {
    if (chatRoom) {
      setMessages(chatRoom.messages);
    }
  }, [chatId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePostClick = () => {
    if (chatRoom) {
      navigate(`/post/detail/${chatRoom.postId}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && chatRoom) {
      const now = new Date();
      const today = now.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMessage = {
        id: Date.now(),
        content: message,
        time,
        isMine: true,
      };

      setMessages((prev) => {
        const lastGroup = prev[prev.length - 1];
        if (lastGroup && lastGroup.date === today) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastGroup,
              items: [...lastGroup.items, newMessage],
            },
          ];
        } else {
          return [
            ...prev,
            {
              id: Date.now(),
              date: today,
              items: [newMessage],
            },
          ];
        }
      });

      setMessage("");
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chatRoom) {
    return (
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Typography>채팅방을 찾을 수 없습니다.</Typography>
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
              {chatRoom.postTitle}
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
                      {chatRoom.nickname.charAt(0)}
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
        ))}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 20,
              },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
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
