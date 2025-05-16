import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface UserProfile {
  nickname: string;
  userName: string;
  email: string;
  phoneNumber: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    nickname: 'HGD',
    userName: '홍길동',
    email: 'hong@example.com',
    phoneNumber: '010-1234-5678',
  });

  const handleBack = () => {
    navigate('/my-page');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log('Updated profile:', profile);
    navigate('/my-page');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRandomColor = () => {
    const colors = [
      '#FF9AA2',
      '#FFB7B2',
      '#FFDAC1',
      '#E2F0CB',
      '#B5EAD7',
      '#C7CEEA',
      '#9FB3DF',
      '#B8B3E9',
      '#D4A5A5',
      '#9CADCE',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Container maxWidth="sm" sx={{ pb: '76px' }}>
      {/* 헤더 */}
      <Paper
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          p: 2,
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
            회원 정보 수정
          </Typography>
        </Stack>
      </Paper>

      {/* 프로필 수정 폼 */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 프로필 이미지 */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: getRandomColor(),
                  fontSize: 40,
                }}
              >
                {profile.nickname.charAt(0)}
              </Avatar>
            </Box>

            {/* 닉네임 */}
            <TextField
              label="닉네임"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* 이름 */}
            <TextField
              label="이름"
              name="userName"
              value={profile.userName}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* 이메일 */}
            <TextField
              label="이메일"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* 전화번호 */}
            <TextField
              label="전화번호"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              fullWidth
              required
              placeholder="010-0000-0000"
            />

            {/* 저장 버튼 */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              저장
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile; 