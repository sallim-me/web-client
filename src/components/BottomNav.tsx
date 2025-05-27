import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useAuthStore } from "@/store/useAuthStore";

// MUI 아이콘 임포트
import ChatIcon from "@mui/icons-material/Chat";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ArticleIcon from "@mui/icons-material/Article";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const tabs = [
    {
      path: "/chat",
      icon: <ChatIcon />,
      activeIcon: <ChatBubbleIcon />,
      label: "채팅",
      requiresAuth: false, // true
    },
    {
      path: "/post/list",
      icon: <ArticleOutlinedIcon />,
      activeIcon: <ArticleIcon />,
      label: "게시판",
      requiresAuth: false,
    },
    {
      path: "/my-page",
      icon: <PersonOutlineIcon />,
      activeIcon: <PersonIcon />,
      label: "마이페이지",
      requiresAuth: false, // true
    },
  ];

  const handleTabClick = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pb: "env(safe-area-inset-bottom)", // iOS safe area
      }}
      elevation={3}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(_, newValue) => {
          const tab = tabs.find((t) => t.path === newValue);
          if (tab) {
            handleTabClick(tab.path, tab.requiresAuth);
          }
        }}
        sx={{
          height: 64,
          "& .MuiBottomNavigationAction-root": {
            color: "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.path}
            value={tab.path}
            label={tab.label}
            icon={location.pathname === tab.path ? tab.activeIcon : tab.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
