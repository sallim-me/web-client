import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Paper,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alarm } from "../../types/alarm";

const StyledListItem = styled(ListItem)<{ isRead: boolean }>(
  ({ theme, isRead }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: isRead ? "inherit" : theme.palette.action.hover,
    cursor: "pointer",
    position: "relative",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  })
);

const BlueDot = styled(Box)<{ show: boolean }>(({ theme, show }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  display: show ? "block" : "none",
}));

const getAlarmTitle = (type: Alarm["type"]): string => {
  switch (type) {
    case "chat":
      return "새로운 채팅이 도착했습니다.";
    case "comment":
      return "내 글에 새로운 댓글이 달렸습니다.";
    case "reply":
      return "내 댓글에 새로운 답글이 달렸습니다.";
    default:
      return "알림";
  }
};

const AlarmPage: React.FC = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = React.useState<Alarm[]>([]);

  const handleAlarmClick = (alarm: Alarm) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === alarm.id ? { ...a, isRead: true } : a))
    );

    if (alarm.targetType === "chat") {
      navigate(`/chat/${alarm.targetId}`);
    } else if (alarm.targetType === "post") {
      navigate(`/post/detail/${alarm.targetId}`);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            알림
          </Typography>
        </Box>
      </Paper>

      <List sx={{ flex: 1, overflow: "auto" }}>
        {alarms.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "text.secondary",
            }}
          >
            <Typography>알림이 없습니다.</Typography>
          </Box>
        ) : (
          alarms.map((alarm) => (
            <StyledListItem
              key={alarm.id}
              isRead={alarm.isRead}
              onClick={() => handleAlarmClick(alarm)}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  {getAlarmTitle(alarm.type)}
                </Typography>
                {alarm.postTitle && (
                  <Typography
                    variant="body2"
                    sx={{ color: "primary.main", fontWeight: 500 }}
                  >
                    {alarm.postTitle}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
                >
                  {alarm.date}
                </Typography>
              </Box>
              <BlueDot show={!alarm.isRead} />
            </StyledListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default AlarmPage;
