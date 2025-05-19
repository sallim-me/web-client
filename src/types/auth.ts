export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  'access-token': string;
  'refresh-token': string;
}

export interface TokenResponse {
  status: number;
  code: string;
  message: string;
  data: {
    'access-token': string;
    'refresh-token': string;
  };
}

export interface LogoutResponse {
  status: number;
  code: string;
  message: string;
  data: string;
} 