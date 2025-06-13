import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import { chatRooms } from "@/data/chatData";

// 타입 정의
interface Chat {
  id: number;
  nickname: string;
  postTitle: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
}

// 더미 데이터 (한국어)
const chatList: Chat[] = [
  {
    id: 1,
    nickname: "김철수",
    postTitle: "삼성 냉장고 팝니다",
    lastMessage: "아직 구매 가능할까요?",
    lastTime: "14:34",
    unread: false,
  },
  {
    id: 2,
    nickname: "이영희",
    postTitle: "중고 자전거 판매",
    lastMessage: "내일 오후 2시에 만날 수 있을까요?",
    lastTime: "어제",
    unread: true,
  },
  {
    id: 3,
    nickname: "박민수",
    postTitle: "아이폰 13 프로",
    lastMessage: "빠른 답변 감사합니다!",
    lastTime: "월",
    unread: false,
  },
];

const getInitial = (nickname: string) => nickname.charAt(0).toUpperCase();

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

  return (
    <Container maxWidth="sm" sx={{ pb: "76px" }}>
      {/* <Paper
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          p: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" align="center">
          채팅
        </Typography>
      </Paper> */}

      <Stack spacing={0}>
        {chatRooms.map((chat) => (
          <Box
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
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
              <Avatar
                sx={{
                  bgcolor: getRandomColor(),
                  width: 48,
                  height: 48,
                }}
              >
                {getInitial(chat.nickname)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="subtitle1" noWrap>
                    {chat.nickname}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ flexShrink: 0 }}
                  >
                    {chat.lastTime}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  {chat.postTitle}
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
                    {chat.lastMessage}
                  </Typography>
                  {chat.unread && (
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontSize: 12,
                        px: 1,
                        py: 0.5,
                        borderRadius: 10,
                        flexShrink: 0,
                      }}
                    >
                      N
                    </Box>
                  )}
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
