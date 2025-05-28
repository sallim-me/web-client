// API 응답 기본 타입
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 에러 응답 타입
export interface ErrorResponse {
  status: number;
  message: string;
  error: string;
}
