import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface UserProfile {
  nickname: string;
  userName: string;
  username: string;
  password: string;
  phoneNumber: string;
  isBuyer: boolean;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    nickname: "HGD",
    userName: "홍길동",
    username: "hong",
    password: "",
    phoneNumber: "010-1234-5678",
    isBuyer: false,
  });

  const handleBack = () => {
    navigate("/my-page");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("Updated profile:", profile);
    navigate("/my-page");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  return (
    <Container maxWidth="sm" sx={{ pb: "76px" }}>
      {/* 헤더 */}
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          p: 2,
          mb: 2,
          borderRadius: 0,
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
        elevation={0}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
            회원 정보 수정
          </Typography>
        </Stack>
      </Paper>

      {/* 프로필 수정 폼 */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 프로필 이미지 */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
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

            {/* 아이디 */}
            <TextField
              label="아이디"
              name="username"
              value={profile.username}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* 비밀번호 */}
            <TextField
              label="비밀번호"
              name="password"
              type="password"
              value={profile.password}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* 바이어 여부 */}
            <FormControlLabel
              control={
                <Checkbox
                  name="isBuyer"
                  checked={profile.isBuyer}
                  onChange={handleChange}
                />
              }
              label="바이어로 활동하기"
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
