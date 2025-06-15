import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Box, styled, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAlarmStore } from "../../store/alarmStore";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  color: theme.palette.text.primary,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { alarms } = useAlarmStore();
  const unreadAlarms = alarms.filter((alarm) => !alarm.isRead).length;

  return (
    <StyledAppBar position="sticky">
      <Toolbar sx={{ justifyContent: "flex-end", minHeight: 60 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => navigate("/alarm")}
            size="large"
            edge="end"
            color="inherit"
            aria-label="notifications"
          >
            <Badge badgeContent={unreadAlarms} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
