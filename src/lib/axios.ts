import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.REACT_APP_API_URL || "https://dev-back.sallim.me";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  withCredentials: true, // CORS 요청에 쿠키 포함
});

// 토큰 갱신 중인지 추적하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 큐
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // 인증이 필요없는 엔드포인트 목록 (reissue 제외)
    const publicEndpoints = ["/auth/login", "/auth/signup"];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      // 로그인/회원가입 요청인 경우 Authorization 헤더 제거
      delete config.headers.Authorization;
    } else if (config.url?.includes("/auth/reissue")) {
      // 토큰 재발급 요청인 경우 refresh token 사용
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        config.headers["Authorization"] = `Bearer ${refreshToken}`;
      }
    } else {
      // 그 외의 요청에는 access token 추가
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // 상세 로깅 추가
    console.log("🚀 Request Details:", {
      url: config.url,
      method: config.method,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization
          ? "Bearer [TOKEN]"
          : undefined,
      },
      data: config.data,
      withCredentials: config.withCredentials,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // 성공 응답 로깅
    console.log("✅ Response Success:", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    // 에러 응답 상세 로깅
    console.error("❌ Response Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: {
        ...error.config?.headers,
        Authorization: error.config?.headers?.Authorization
          ? "Bearer [TOKEN]"
          : undefined,
      },
      data: error.response?.data,
      withCredentials: error.config?.withCredentials,
    });

    if (!error.response) {
      return Promise.reject(new Error("서버에 연결할 수 없습니다."));
    }

    const originalRequest = error.config;

    // 401 에러 처리 (토큰 만료)
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/reissue")
    ) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting token refresh...");
        await useAuthStore.getState().reissueToken();
        const newAccessToken = useAuthStore.getState().accessToken;
        
        console.log("🔍 Checking new access token:", {
          hasToken: !!newAccessToken,
          tokenPreview: newAccessToken ? newAccessToken.substring(0, 20) + "..." : "null"
        });
        
        if (!newAccessToken) {
          throw new Error("Token refresh returned null token");
        }
        
        console.log("✅ Token refresh successful, retrying original request");
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        
        // 로그아웃 처리 및 로그인 페이지로 리다이렉트
        console.log("🚪 Logging out and redirecting to login...");
        await useAuthStore.getState().logout();
        
        // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
        if (!window.location.pathname.includes('/login')) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          console.log("🔄 Redirecting to login page...");
          window.location.href = '/login';
        }
        
        return Promise.reject(
          new Error("세션이 만료되었습니다. 다시 로그인해주세요.")
        );
      } finally {
        isRefreshing = false;
      }
    }

    // 403 에러 처리
    if (error.response.status === 403) {
      console.error("403 Forbidden error:", {
        url: originalRequest.url,
        headers: originalRequest.headers,
        data: error.response.data,
      });
      return Promise.reject(new Error("접근 권한이 없습니다."));
    }

    const errorMessage = error.response.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);
