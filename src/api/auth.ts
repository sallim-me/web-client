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

  getProfile: async (): Promise<UserProfile> => {
    try {
      console.log("Fetching user profile...");
      const response = await axiosInstance.get<UserProfile>(`${MEMBER_URL}/me`);
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
};
