import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Stack,
  Divider,
  Alert,
  Badge,
  Skeleton,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi, chatUtils } from "@/api/chat";
import { useAuthStore } from "@/store/useAuthStore";

// 채팅방 표시용 데이터 타입
interface ChatRoomDisplayData {
  id: string;
  productTitle: string;
  otherUserNickname: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const getInitial = (nickname: string) => nickname?.charAt(0)?.toUpperCase();

const getRandomColor = () => {
  const colors = [
    "#FF9AA2",
    "#FFB7B2",
    "#FFDAC1",
    "#E2F0CB",
    "#B5EAD7",
    "#C7CEEA",
    "#9FB3DF",
    "#B8B3E9",
    "#D4A5A5",
    "#9CADCE",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ChatList = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const [displayChatRooms, setDisplayChatRooms] = useState<ChatRoomDisplayData[]>([]);

  // 사용자가 변경되거나 로그아웃 시 캐시 정리
  useEffect(() => {
    if (userProfile?.memberId) {
      // 현재 사용자가 아닌 모든 채팅방 캐시 무효화
      queryClient.removeQueries({
        predicate: (query) => {
          const [queryKey, userId] = query.queryKey as [string, number?];
          return queryKey === "chatRooms" && userId !== userProfile.memberId;
        },
      });
    } else {
      // 로그아웃 상태일 때 모든 채팅 관련 캐시 정리
      queryClient.removeQueries({
        predicate: (query) => {
          const [queryKey] = query.queryKey as [string];
          return queryKey === "chatRooms" || queryKey === "chatMessages" || queryKey === "chatRoomStatus";
        },
      });
    }
    
    // 표시용 데이터도 초기화
    setDisplayChatRooms([]);
  }, [userProfile?.memberId, queryClient]);

  // 채팅방 목록 조회 (사용자별로 캐시 분리)
  const {
    data: chatRoomsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chatRooms", userProfile?.memberId], // 사용자 ID를 캐시 키에 포함
    queryFn: () => chatApi.getChatRooms(),
    enabled: !!userProfile?.memberId, // 사용자 ID가 있을 때만 실행
    refetchInterval: 30000, // 30초마다 자동 새로고침
    staleTime: 0, // 즉시 stale로 설정하여 새로운 데이터 요청
    gcTime: 5 * 60 * 1000, // 5분 후 캐시 삭제 (구 cacheTime)
  });

  const chatRooms = useMemo(() => {
    return chatRoomsResponse?.data || [];
  }, [chatRoomsResponse?.data]);

  // 서버 데이터를 표시용 데이터로 변환
  useEffect(() => {
    const processChateRooms = async () => {
      if (!chatRooms?.length || !userProfile?.memberId) return;

      try {
        const processedRooms: ChatRoomDisplayData[] = await Promise.all(
          chatRooms.map(async (room) => {
            // 추가 정보 조회 (임시로 간단한 데이터 사용)
            const details = await chatApi.getChatRoomDetails(room, userProfile.memberId);

            return {
              id: chatUtils.roomIdToString(room.id),
              productTitle: details.productTitle || `상품 ${room.productId}`,
              otherUserNickname: details.otherUserNickname || "사용자",
              lastMessage: room.latestMessage || "",
              lastMessageTime: chatUtils.formatTime(room.latestMessageTime),
              unreadCount: room.unreadCount || 0,
            };
          })
        );

        setDisplayChatRooms(processedRooms);
      } catch (error) {
        console.error("Failed to process chat rooms:", error);
        setDisplayChatRooms([]);
      }
    };

    processChateRooms();
  }, [chatRooms, userProfile?.memberId]);

  // 채팅방 클릭 핸들러
  const handleChatClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  // 스켈레톤 컴포넌트
  const ChatListSkeleton = () => {
    return (
      <Container maxWidth="sm" sx={{ pb: "76px" }}>
        <Stack spacing={0}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Box key={index} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="20%" height={16} />
                  </Stack>
                  <Skeleton variant="text" width="60%" height={16} sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" width="80%" height={16} sx={{ mt: 0.5 }} />
                </Box>
              </Stack>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
      </Container>
    );
  };

  // 로딩 상태 또는 데이터 처리 중
  if (isLoading || (chatRooms.length > 0 && displayChatRooms.length === 0)) {
    return <ChatListSkeleton />;
  }

  // 에러 상태
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Alert severity="error">
          채팅방 목록을 불러올 수 없습니다.
          <button onClick={() => refetch()}>다시 시도</button>
        </Alert>
      </Container>
    );
  }

  // 빈 상태
  if (displayChatRooms.length === 0 && !isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, p: 2, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          채팅 내역이 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          상품 페이지에서 판매자와 채팅을 시작해보세요
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pb: "76px" }}>
      <Stack spacing={0}>
        {displayChatRooms.map((chatRoom) => (
          <Box
            key={chatRoom.id}
            onClick={() => handleChatClick(chatRoom.id)}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ p: 2 }}
              alignItems="center"
            >
              <Badge
                badgeContent={chatRoom.unreadCount > 0 ? chatRoom.unreadCount : 0}
                color="error"
                invisible={chatRoom.unreadCount === 0}
              >
                <Avatar
                  sx={{
                    bgcolor: getRandomColor(),
                    width: 48,
                    height: 48,
                  }}
                >
                  {getInitial(chatRoom.otherUserNickname)}
                </Avatar>
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="subtitle1" noWrap>
                    {chatRoom.otherUserNickname}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ flexShrink: 0 }}
                  >
                    {chatRoom.lastMessageTime}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  {chatRoom.productTitle}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chatRoom.lastMessage || "메시지가 없습니다"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Divider />
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default ChatList;
