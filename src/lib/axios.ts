import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// 개발 환경과 배포 환경에 따라 BASE_URL 설정
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://dev-back.sallim.me"
    : "https://api.sallim.me";

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
    const token = useAuthStore.getState().accessToken; // Zustand 스토어에서 토큰 가져오기
    const url = config.url || ""; // url이 undefined일 경우 대비
    const method = config.method?.toLowerCase(); // method를 소문자로 변환하고 undefined 대비

    // 토큰이 필요 없는 public 경로 목록 (메소드 무관)
    const publicPaths = ["/auth/login", "/auth/reissue"];
    const isPublicPathOnly = publicPaths.some((path) => url.includes(path));

    // 특정 메서드+경합 조합에 대해 토큰 포함 여부 결정
    const isSignUpPost = method === "post" && url.includes("/member/profile"); // 회원가입 POST: 토큰 제외
    const isEditProfilePatch =
      method === "patch" && url.includes("/member/profile"); // 회원 정보 수정 PATCH: 토큰 포함

    // 기본 로직: 토큰이 있고 public 경로가 아니거나 회원 정보 수정 PATCH 요청일 때 토큰 추가
    // 그리고 회원가입 POST 요청이 아닐 때 토큰 추가
    if (token && (!isPublicPathOnly || isEditProfilePatch) && !isSignUpPost) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        `axios: Added Authorization header for ${String(
          method
        ).toUpperCase()} ${url}.`
      ); // 토큰 추가 로그
    } else if (isSignUpPost) {
      // 회원가입 POST 요청 시에는 토큰 제거
      delete config.headers.Authorization;
      console.log(
        `axios: Removed Authorization header for signup POST ${url}.`
      ); // 회원가입 토큰 제거 로그
    } else if (!token) {
      // 토큰이 없는 경우 (로그인 이전 또는 로그아웃 상태)
      console.log("axios: No token available, no Authorization header added."); // 토큰 없을 시 로그
      delete config.headers.Authorization; // 토큰이 없으면 헤더 삭제 (혹시 남아있을 경우)
    } else if (isPublicPathOnly && !isEditProfilePatch) {
      // 로그인, 토큰 재발급 등 순수 public 경로는 토큰 제거
      delete config.headers.Authorization;
      console.log(
        `axios: Removed Authorization header for public path: ${url}`
      ); // Public 경로 토큰 제거 로그
    }

    // 요청 직전 config 로그 추가
    console.log("axios: Request config before sending:", {
      // 요청 직전 로그 추가
      url: url,
      method: method,
      headers: config.headers as RawAxiosRequestHeaders, // 실제 헤더 확인 (타입 캐스팅)
      // data: config.data // 데이터는 민감할 수 있으므로 필요시 주석 해제
    });

    return config;
  },
  (error: AxiosError) => {
    // 요청 에러 처리
    console.error("axios: Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("axios: Response received:", response); // 응답 로그 (too noisy)
    return response;
  },
  async (error: AxiosError) => {
    console.error("axios: Response error:", error);
    // _retry 속성을 위해 캐스팅 시도
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const url = originalRequest?.url || "N/A";
    const method = originalRequest?.method?.toLowerCase() || "N/A";
    const headers = originalRequest?.headers || {}; // headers가 없을 경우 빈 객체 사용

    // 401 Unauthorized 에러 처리 (토큰 만료 등)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 재시도 플래그
      console.log("axios: 401 Unauthorized error, attempting token reissue.");
      try {
        const authStore = useAuthStore.getState();
        await authStore.reissueToken(); // 토큰 재발급 시도
        const newAccessToken = authStore.accessToken;
        if (newAccessToken) {
          // 새 액세스 토큰으로 헤더 업데이트 및 원본 요청 재시도
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          }; // 헤더 업데이트
          console.log("axios: Token reissued, retrying original request.");
          return axiosInstance(originalRequest); // 원본 요청 재시도
        }
      } catch (reissueError) {
        console.error("axios: Token reissue failed.", reissueError);
        // 토큰 재발급 실패 시 로그인 페이지로 리다이렉트 또는 로그아웃 처리
        const authStore = useAuthStore.getState();
        await authStore.logout(); // 로그아웃 상태로 변경
        // window.location.href = '/login'; // 클라이언트 라우팅 사용 시 navigate 사용 고려
      }
    }

    // 403 Forbidden 에러 로깅 추가 (요청 정보 포함)
    if (error.response?.status === 403) {
      console.error("axios: 403 Forbidden error:", {
        url: url,
        method: String(method).toUpperCase(), // method를 안전하게 문자열로 변환 후 대문자화
        headers: headers as RawAxiosRequestHeaders, // 403 에러 발생 시 요청 헤더 안전하게 확인 (타입 캐스팅)
        data: error.response?.data, // 서버에서 보낸 403 응답 데이터 확인
      });
    }

    // 다른 에러는 그대로 반환
    return Promise.reject(error);
  }
);
