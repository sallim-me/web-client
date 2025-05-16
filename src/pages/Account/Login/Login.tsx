import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from '@mui/material';

interface LoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
    console.log('Login form submitted:', formData);
    // 임시로 로그인 성공 처리
    localStorage.setItem('token', 'dummy-token');
    navigate('/post/list');
  };

  return (
    <Container maxWidth="sm" sx={{ pb: '76px' }}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Typography variant="h5" align="center" gutterBottom>
              로그인
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="아이디"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <TextField
                  label="비밀번호"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  로그인
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/signup')}
                >
                  회원가입
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 