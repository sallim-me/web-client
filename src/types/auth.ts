export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
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
