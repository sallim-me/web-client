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
  id?: number;
  username: string;
  name: string;
  nickname: string;
  isBuyer: boolean;
  profileColor: string;
}
