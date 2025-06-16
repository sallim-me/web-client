import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, styled } from "@mui/material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  color: theme.palette.text.primary,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledAppBar position="sticky">
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 60 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{
              height: "40px",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* 알람 아이콘이 제거되었습니다. */}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
