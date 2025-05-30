import { axiosInstance } from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
  UserProfile,
} from "@/types/auth";

// 사용자 프로필 API 응답 타입을 정의합니다.
interface UserProfileApiResponse {
  status: number;
  code: string;
  message: string;
  data: UserProfile; // 실제 사용자 정보는 data 속성에 포함
}

// 프로필 수정 요청 타입
interface EditProfileRequest {
  nickname: string;
  name: string;
  password?: string; // 선택적 필드로 변경
  isBuyer: boolean;
}

const AUTH_URL = "/auth";
const MEMBER_URL = "/member";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log("Login attempt with:", { username: data.username });

      // 로그인 요청 시 Authorization 헤더 제거
      const response = await axiosInstance.post<LoginResponse>(
        `${AUTH_URL}/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: undefined, // 기존 토큰 제거
          },
          withCredentials: true, // 쿠키 인증 대비
        }
      );

      console.log("Login response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error("Login error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  reissue: async (): Promise<TokenResponse> => {
    const response = await axiosInstance.post<TokenResponse>(
      `${AUTH_URL}/reissue`
    );
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosInstance.post<LogoutResponse>(
      `${AUTH_URL}/logout`
    );
    return response.data;
  },

  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await axiosInstance.post<SignUpResponse>(
      `${MEMBER_URL}/profile`,
      data
    );
    return response.data;
  },

  // 반환 타입을 UserProfileApiResponse로 수정
  getProfile: async (): Promise<UserProfileApiResponse> => {
    try {
      console.log("Fetching user profile...");
      const response = await axiosInstance.get<UserProfileApiResponse>(
        `${MEMBER_URL}/me`
      );
      console.log("Profile response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get profile error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  // 프로필 수정 API 추가
  editProfile: async (
    data: EditProfileRequest
  ): Promise<UserProfileApiResponse> => {
    try {
      console.log("Editing profile with data:", data);
      const response = await axiosInstance.put<UserProfileApiResponse>(
        `${MEMBER_URL}/profile`,
        data
      );
      console.log("Profile edit response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Edit profile error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },
};
