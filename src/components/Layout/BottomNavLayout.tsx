import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import BottomNav from '../BottomNav';
import MobileLayout from './MobileLayout';

export const BottomNavLayout = () => {
  return (
    <MobileLayout>
      <Box
        sx={{
          minHeight: '100vh',
          pb: '64px', // BottomNav 높이만큼 패딩
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
        <BottomNav />
      </Box>
    </MobileLayout>
  );
};

export default BottomNavLayout; 