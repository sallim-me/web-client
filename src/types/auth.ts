export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  "access-token": string;
  "refresh-token": string;
}

export interface TokenResponse {
  "access-token": string;
  "refresh-token": string;
}

// 새로운 API 응답 래퍼 타입
export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

// 토큰 재발급 API 응답 타입
export interface TokenReissueResponse {
  status: number;
  code: string;
  message: string;
  data: {
    "access-token": string;
    "refresh-token": string;
  };
  timestamp: string;
}

export interface LogoutResponse {
  message: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  nickname: string;
  name: string;
  isBuyer: boolean;
}

export interface SignUpResponse {
  id: number;
  username: string;
  nickname: string;
  name: string;
  isBuyer: boolean;
}

export interface UserProfile {
  memberId?: number;
  username: string;
  name: string;
  nickname: string;
  isBuyer: boolean;
  profileColor?: string;
}
