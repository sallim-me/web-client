import axios from "axios";

// API 기본 설정
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080", // API 서버 주소
  timeout: 5000, // 요청 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    return response;
  },
  (error) => {
    // 오류 응답을 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      switch (error.response.status) {
        case 401:
          // 인증 오류 처리
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // 권한 오류 처리
          console.error("접근 권한이 없습니다.");
          break;
        case 404:
          // 리소스를 찾을 수 없는 경우
          console.error("요청한 리소스를 찾을 수 없습니다.");
          break;
        default:
          // 기타 오류 처리
          console.error("서버 오류가 발생했습니다.");
      }
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error("서버로부터 응답이 없습니다.");
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error("요청 설정 중 오류가 발생했습니다.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
