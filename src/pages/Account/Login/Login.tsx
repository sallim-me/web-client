import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Alert,
} from "@mui/material";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginRequest } from "@/types/auth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(formData.username, formData.password);
      navigate("/post/list");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error ? error.message : "로그인에 실패했습니다."
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pb: "76px" }}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Typography variant="h5" align="center" gutterBottom>
              로그인
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

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
                  disabled={isLoading}
                  autoComplete="username"
                  error={!!error && error.includes("아이디")}
                />

                <TextField
                  label="비밀번호"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  error={!!error && error.includes("비밀번호")}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() => navigate("/signup")}
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
