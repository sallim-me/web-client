import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  chatApi,
  ChatMessageDTO,
  chatWebSocketClient,
  WebSocketReceiveMessage,
  WebSocketConnectionStatus,
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
  const [connectionStatus, setConnectionStatus] =
    useState<WebSocketConnectionStatus>({ connected: false });
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const userProfile = useAuthStore((state) => state.userProfile);

  // 웹소켓 메시지 수신 처리
  const handleWebSocketMessage = useCallback(
    (wsMessage: WebSocketReceiveMessage) => {
      console.log("🎯 Handling WebSocket message:", wsMessage);
      if (!userProfile) {
        console.warn("⚠️  No user profile, ignoring message");
        return;
      }

      const newMessage: ExtendedMessage = {
        id: wsMessage.id,
        chatRoomId: wsMessage.chatRoomId,
        senderId: wsMessage.senderId,
        receiverId: wsMessage.receiverId,
        content: wsMessage.content,
        createdAt: wsMessage.createdAt,
        isMine: wsMessage.senderId === userProfile.memberId,
        time: new Date(wsMessage.createdAt).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      console.log("📝 New message created:", newMessage);

      // 상대방 메시지인 경우 읽음 처리
      if (!newMessage.isMine && chatId) {
        console.log("📖 Marking new message as read");
        chatApi.markMessagesAsRead(chatId).catch((error) => {
          console.error("❌ Failed to mark message as read:", error);
        });
      }

      setMessages((prevMessages) => {
        const messageDate = new Date(wsMessage.createdAt);
        const today = messageDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const updatedMessages = [...prevMessages];
        let todayGroup = updatedMessages.find((group) => group.date === today);

        if (!todayGroup) {
          todayGroup = {
            id: today,
            date: today,
            items: [],
          };
          updatedMessages.push(todayGroup);
          console.log("📅 Created new date group:", today);
        }

        // 중복 메시지 체크
        const existingMessage = todayGroup.items.find(
          (msg) => msg.id === newMessage.id
        );
        if (!existingMessage) {
          todayGroup.items.push(newMessage);
          todayGroup.items.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          console.log("✅ Message added to group:", newMessage.content);
        } else {
          console.log("⚠️  Duplicate message ignored:", newMessage.id);
        }

        const sortedMessages = updatedMessages.sort(
          (a, b) =>
            new Date(a.items[0].createdAt).getTime() -
            new Date(b.items[0].createdAt).getTime()
        );

        console.log("📊 Updated messages:", sortedMessages);
        return sortedMessages;
      });
    },
    [userProfile, chatId]
  );

  // 웹소켓 연결 상태 변경 처리
  const handleConnectionChange = useCallback(
    (connected: boolean, error?: string) => {
      setConnectionStatus({ connected, error });
    },
    []
  );

  // 채팅방 입장 시 웹소켓 연결 및 설정
  useEffect(() => {
    if (!chatId || !userProfile) return;

    let isCleanedUp = false;

    const setupWebSocket = async () => {
      try {
        console.log("🚀 Setting up WebSocket for room:", chatId);

        // 채팅방 입장 API 호출
        await chatApi.enterChatRoom(chatId);
        console.log("✅ Entered chat room via API");

        // 채팅방 입장 시 읽음 처리 (전체 방 읽음 처리)
        await chatApi.markRoomAsRead(chatId);
        console.log("✅ Marked room as read on entry");

        if (isCleanedUp) return;

        // 먼저 콜백들을 등록
        chatWebSocketClient.onConnectionChange(handleConnectionChange);
        chatWebSocketClient.onMessage(chatId, handleWebSocketMessage);
        console.log("✅ Callbacks registered");

        // 웹소켓 연결
        if (!chatWebSocketClient.isConnected()) {
          console.log("🔌 Connecting to WebSocket...");
          await chatWebSocketClient.connect();
          console.log("✅ WebSocket connected");
        }

        if (isCleanedUp) return;

        // 채팅방 구독
        console.log("🔔 Subscribing to chat room...");
        chatWebSocketClient.subscribeToChatRoom(chatId);
        console.log("✅ Subscribed to chat room");
      } catch (error) {
        console.error("❌ Failed to setup WebSocket:", error);
        setConnectionStatus({
          connected: false,
          error: "연결에 실패했습니다.",
        });
      }
    };

    setupWebSocket();

    // 정리 함수
    return () => {
      console.log("🧹 Cleaning up WebSocket for room:", chatId);
      isCleanedUp = true;
      if (chatId) {
        chatWebSocketClient.unsubscribeFromChatRoom(chatId);
        chatApi.exitChatRoom(chatId).catch(console.error);
      }
    };
  }, [chatId, userProfile, handleConnectionChange, handleWebSocketMessage]);

  // 채팅방 상태 조회
  const {
    data: chatRoomStatus,
    isLoading: statusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ["chatRoomStatus", chatId, userProfile?.memberId],
    queryFn: () => chatApi.getChatRoomStatus(chatId!),
    enabled: !!chatId && !!userProfile?.memberId,
    staleTime: 30000,
    gcTime: 300000,
  });

  // 채팅 메시지 조회
  const {
    data: chatMessages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["chatMessages", chatId, userProfile?.memberId],
    queryFn: () => chatApi.getMessages(chatId!),
    enabled: !!chatId && !!userProfile?.memberId,
    staleTime: 10000,
    gcTime: 300000,
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

      const messageGroups: MessageGroup[] = Object.entries(groupedMessages).map(
        ([date, items]) => ({
          id: date,
          date,
          items: items.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        })
      );

      setMessages(
        messageGroups.sort(
          (a, b) =>
            new Date(a.items[0].createdAt).getTime() -
            new Date(b.items[0].createdAt).getTime()
        )
      );
    }
  }, [chatMessages, userProfile]);

  // 메시지 전송 (웹소켓 사용)
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!chatId) throw new Error("Chat ID not found");

      console.log("📤 Attempting to send message:", content);

      // 웹소켓이 연결되어 있으면 웹소켓으로 전송, 아니면 REST API 사용
      if (chatWebSocketClient.isConnected()) {
        console.log("📤 Sending via WebSocket");
        chatWebSocketClient.sendMessage(chatId, content);
        return { success: true, method: "websocket" };
      } else {
        console.log("📤 Sending via REST API (fallback)");
        // 폴백: REST API 사용
        const result = await chatApi.sendMessage(chatId, { content });
        return { success: true, method: "rest", data: result };
      }
    },
    onSuccess: (result) => {
      console.log("✅ Message sent successfully:", result);
      // 웹소켓으로 전송한 경우 메시지는 실시간으로 수신됨
      // REST API로 전송한 경우에만 쿼리 무효화
      if (result.method === "rest") {
        console.log("🔄 Invalidating queries for REST API send");
        queryClient.invalidateQueries({ queryKey: ["chatMessages", chatId] });
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      } else {
        console.log("⏳ Waiting for WebSocket message to arrive");
      }
    },
    onError: (error) => {
      console.error("❌ 메시지 전송 실패:", error);
    },
  });

  const handleBack = () => {
    navigate("/chat");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
      setMessage("");
      // 메시지 전송 후 입력창에 포커스 재설정
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSendButtonClick = () => {
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
      setMessage("");
      // 전송 버튼 클릭 후 입력창에 포커스 재설정
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 채팅방 입장 시 입력창에 포커스
  useEffect(() => {
    if (userProfile && chatId) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 500); // 웹소켓 연결 완료 후 포커스

      return () => clearTimeout(timer);
    }
  }, [userProfile, chatId]);

  // 로딩 상태
  if (statusLoading || messagesLoading) {
    return (
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          sx={{ mb: 2 }}
        />
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Stack
              key={index}
              direction={index % 2 === 0 ? "row" : "row-reverse"}
              spacing={1}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton
                variant="rectangular"
                width={200}
                height={40}
                sx={{ borderRadius: 2 }}
              />
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
        <Alert severity="error">채팅방 정보를 불러오는데 실패했습니다.</Alert>
      </Container>
    );
  }

  // 채팅방이 없는 경우
  if (!chatRoomStatus) {
    return (
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Alert severity="info">채팅방을 찾을 수 없습니다.</Alert>
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
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Chip
              label={chatRoomStatus.data?.productTitle || "채팅방"}
              variant="outlined"
              clickable
              onClick={() => {
                if (chatRoomStatus.data?.productId) {
                  navigate(`/post/detail/${chatRoomStatus.data.productId}${chatRoomStatus.data.productType ? `?type=${chatRoomStatus.data.productType.toLowerCase()}` : ''}`);
                }
              }}
              sx={{
                maxWidth: "200px",
                color: "white",
                borderColor: "white",
                fontSize: "0.875rem",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "150px",
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
          </Box>
          {/* 연결 상태 표시 */}
          {/* <Chip
            size="small"
            label={connectionStatus.connected ? "연결됨" : "연결 안됨"}
            color={connectionStatus.connected ? "success" : "error"}
            sx={{ 
              backgroundColor: connectionStatus.connected ? "success.light" : "error.light",
              color: "white",
              fontSize: "0.75rem"
            }}
          /> */}
        </Stack>
        {connectionStatus.error && (
          <Typography
            variant="caption"
            sx={{ color: "error.light", mt: 0.5, display: "block" }}
          >
            {connectionStatus.error}
          </Typography>
        )}
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
                          borderRadius: msg.isMine
                            ? "16px 16px 0 16px"
                            : "16px 16px 16px 0",
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
            inputRef={inputRef}
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
            onClick={handleSendButtonClick}
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
