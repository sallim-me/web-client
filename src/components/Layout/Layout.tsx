import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import BottomNav from "../BottomNav";

interface LayoutProps {
  showHeader?: boolean;
  showBottomNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  showHeader = true,
  showBottomNav = true,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {showHeader && <Header />}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          pb: showBottomNav ? "56px" : 0, // BottomNav 높이만큼 패딩
        }}
      >
        <Outlet />
      </Box>
      {showBottomNav && <BottomNav />}
    </Box>
  );
};

export default Layout;
