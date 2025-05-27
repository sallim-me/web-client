import { axiosInstance } from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  TokenResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";

const AUTH_URL = "/auth";
const MEMBER_URL = "/member";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      `${AUTH_URL}/login`,
      data
    );
    return response.data;
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
};
