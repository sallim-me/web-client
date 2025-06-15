import React, { useState, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthStore } from "@/store/useAuthStore";
import { memberApi, EditProfileRequest } from "@/api/member";
import { getProfileColor } from "@/utils/color";

// EditProfile 컴포넌트 내에서 사용할 폼 상태의 타입을 정의합니다.
// member/me 응답과 다를 수 있습니다 (예: password 포함).
interface EditProfileFormState {
  nickname: string;
  name: string;
  username: string;
  password: string; // 비밀번호 필드 추가
  isBuyer: boolean;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { userProfile, fetchUserProfile, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 상태는 userProfile 로딩 상태와 별개로 관리하되, userProfile이 로드되면 초기값을 설정합니다.
  const [profile, setProfile] = useState<EditProfileFormState>({
    nickname: "",
    name: "",
    username: "",
    password: "", // 초기 비밀번호는 비워둡니다.
    isBuyer: false,
  });

  // userProfile 정보가 로드되면 로컬 profile 상태를 업데이트합니다.
  useEffect(() => {
    if (userProfile) {
      console.log(
        "EditProfile: User profile loaded, updating form state.",
        userProfile
      ); // 회원 정보 로드 시 로그
      setProfile((prevProfile) => ({
        nickname: userProfile.nickname,
        name: userProfile.name,
        username: userProfile.username,
        password: prevProfile.password, // 비밀번호는 userProfile에서 가져오지 않고 기존 입력값 유지
        isBuyer: userProfile.isBuyer,
      }));
    } else if (!isLoading) {
      console.log(
        "EditProfile: User profile not found or loading finished, attempting to fetch."
      ); // 로딩 후 프로필 없을 시 로그
      fetchUserProfile();
    }
  }, [userProfile, isLoading, fetchUserProfile]);

  const handleBack = () => {
    navigate("/my-page");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // API 요청 데이터 구성
      const editData: EditProfileRequest = {
        username: profile.username,
        name: profile.name,
        password: profile.password,
        nickname: profile.nickname,
        isBuyer: profile.isBuyer,
      };

      console.log("EditProfile: Submitting profile edit data:", editData); // 제출 데이터 로그
      const response = await memberApi.editProfile(editData); // API 호출 결과 저장
      console.log("EditProfile: Profile edit API successful.", response); // API 성공 응답 로그

      // 프로필 정보 새로고침
      console.log("EditProfile: Fetching user profile after edit."); // 프로필 새로고침 전 로그
      await fetchUserProfile();
      console.log("EditProfile: User profile fetched after edit."); // 프로필 새로고침 후 로그

      // 성공 시 마이페이지로 이동
      console.log("EditProfile: Navigating to /my-page."); // 리다이렉트 전 로그
      navigate("/my-page");
    } catch (error: any) {
      console.error("EditProfile: Profile edit error:", error); // API 에러 로그
      setError(
        error.response?.data?.message ||
          "프로필 수정에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 로딩 중이거나 userProfile이 없을 때 로딩 상태 또는 메시지 표시
  if (isLoading && !userProfile) {
    console.log("EditProfile: Loading initial profile..."); // 초기 로딩 상태 로그
    return (
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        프로필 정보를 불러오는 중입니다...
      </Container>
    );
  }

  if (!userProfile) {
    console.log("EditProfile: User profile not available after initial load."); // 초기 로딩 후 프로필 없을 시 로그
    return (
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        프로필 정보를 가져오는데 실패했습니다. 다시 로그인해주세요.
      </Container>
    );
  }

  // userProfile이 로드되면 폼 내용을 렌더링
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 프로필 이미지 - 현재는 아바타로 표시 */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor:
                    userProfile?.profileColor ||
                    getProfileColor(userProfile?.username || ""),
                  fontSize: 40,
                }}
              >
                {profile.nickname ? profile.nickname.charAt(0) : ""}
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
              margin="normal"
            />

            {/* 이름 */}
            <TextField
              label="이름"
              name="name"
              value={profile.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            {/* 아이디 (읽기 전용) */}
            <TextField
              label="아이디"
              name="username"
              value={profile.username}
              fullWidth
              required
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
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
              margin="normal"
              helperText="비밀번호를 변경하지 않으려면 현재 비밀번호를 입력해주세요."
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile;
