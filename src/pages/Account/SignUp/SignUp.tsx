import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from "@mui/material";
import { authApi } from "@/api/auth";
import { SignUpRequest } from "@/types/auth";

interface SignUpForm extends SignUpRequest {
  passwordCheck: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  passwordCheck?: string;
  name?: string;
  nickname?: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpForm>({
    username: "",
    password: "",
    passwordCheck: "",
    name: "",
    nickname: "",
    isBuyer: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const nicknameTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "nickname") {
      setIsNicknameAvailable(null);
      if (nicknameTimeoutRef.current) {
        clearTimeout(nicknameTimeoutRef.current);
      }
    }
  };

  useEffect(() => {
    if (formData.nickname) {
      nicknameTimeoutRef.current = setTimeout(() => {
        // 실제로는 API 호출로 중복 확인
        // 임시로 랜덤하게 결정
        const isAvailable = Math.random() > 0.5;
        setIsNicknameAvailable(isAvailable);
      }, 1000);
    }

    return () => {
      if (nicknameTimeoutRef.current) {
        clearTimeout(nicknameTimeoutRef.current);
      }
    };
  }, [formData.nickname]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.username) newErrors.username = "아이디를 입력해주세요";
    if (!formData.password) newErrors.password = "비밀번호를 입력해주세요";
    if (!formData.passwordCheck)
      newErrors.passwordCheck = "비밀번호 확인을 입력해주세요";
    if (formData.password !== formData.passwordCheck) {
      newErrors.passwordCheck = "비밀번호가 일치하지 않습니다";
    }
    if (!formData.name) newErrors.name = "이름을 입력해주세요";
    if (!formData.nickname) newErrors.nickname = "닉네임을 입력해주세요";
    if (formData.nickname.length > 10) {
      newErrors.nickname = "닉네임은 10자 이내로 입력해주세요";
    }
    if (isNicknameAvailable === false) {
      newErrors.nickname = "이미 사용 중인 닉네임입니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError(null);

    try {
      const { passwordCheck, ...signUpData } = formData;
      await authApi.signUp(signUpData);
      navigate("/login", {
        state: { message: "회원가입이 완료되었습니다. 로그인해주세요." },
      });
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
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
        <Paper sx={{ p: 4, border: "none", boxShadow: "none" }}>
          <Stack spacing={3}>
            <Typography variant="h5" align="center" gutterBottom>
              회원가입
            </Typography>

            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="아이디"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  fullWidth
                  required
                  disabled={isLoading}
                />

                <TextField
                  label="비밀번호"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  required
                  disabled={isLoading}
                />

                <TextField
                  label="비밀번호 확인"
                  name="passwordCheck"
                  type="password"
                  value={formData.passwordCheck}
                  onChange={handleChange}
                  error={!!errors.passwordCheck}
                  helperText={errors.passwordCheck}
                  fullWidth
                  required
                  disabled={isLoading}
                />

                <TextField
                  label="이름"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                  disabled={isLoading}
                />

                <TextField
                  label="닉네임"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  error={!!errors.nickname}
                  helperText={errors.nickname}
                  fullWidth
                  required
                  disabled={isLoading}
                />

                {formData.nickname && (
                  <Alert
                    severity={
                      isNicknameAvailable === null
                        ? "info"
                        : isNicknameAvailable
                        ? "success"
                        : "error"
                    }
                  >
                    {isNicknameAvailable === null
                      ? "닉네임 확인 중..."
                      : isNicknameAvailable
                      ? "사용 가능한 닉네임입니다"
                      : "이미 사용 중인 닉네임입니다"}
                  </Alert>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      name="isBuyer"
                      checked={formData.isBuyer}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  }
                  label="바이어 여부"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "회원가입"}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
