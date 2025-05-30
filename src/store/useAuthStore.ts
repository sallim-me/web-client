import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/api/auth";
import { LoginRequest, UserProfile } from "@/types/auth";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userProfile: UserProfile | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reissueToken: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  clearError: () => void;
}

const initialState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userProfile: null,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        login: async (username: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            console.log("Login attempt with username:", username);
            const response = await authApi.login({ username, password });
            console.log("Login response received:", response);

            // 응답이 없거나 토큰이 없는 경우 에러 처리
            if (
              !response ||
              !response["access-token"] ||
              !response["refresh-token"]
            ) {
              console.error("Invalid login response:", response);
              throw new Error("로그인 응답이 올바르지 않습니다.");
            }

            // 로그인 성공 시 토큰 저장
            const tokens = {
              accessToken: response["access-token"],
              refreshToken: response["refresh-token"],
            };
            console.log("Storing tokens:", tokens);

            set({
              ...tokens,
              isAuthenticated: true,
              isLoading: false,
            });

            // 사용자 프로필 정보 가져오기
            console.log("Fetching user profile...");
            await get().fetchUserProfile();
            console.log("User profile fetched successfully");
          } catch (error) {
            console.error("Login error:", error);
            set({
              isAuthenticated: false,
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "로그인에 실패했습니다.",
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true, error: null });
          try {
            await authApi.logout();
            set({
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              userProfile: null,
            });
          } catch (error) {
            console.error("Logout error:", error);
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "로그아웃에 실패했습니다.",
            });
            throw error;
          }
        },

        reissueToken: async () => {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error("리프레시 토큰이 없습니다.");
          }

          set({ isLoading: true, error: null });
          try {
            console.log("Attempting to reissue token...");
            const response = await authApi.reissue();
            console.log("Token reissue response:", response);

            if (
              !response ||
              !response["access-token"] ||
              !response["refresh-token"]
            ) {
              console.error("Invalid token reissue response:", response);
              throw new Error("토큰 갱신에 실패했습니다.");
            }

            const tokens = {
              accessToken: response["access-token"],
              refreshToken: response["refresh-token"],
            };
            console.log("Storing new tokens:", tokens);

            set({
              ...tokens,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            console.error("Token reissue error:", error);
            set({
              isAuthenticated: false,
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "토큰 갱신에 실패했습니다.",
            });
            throw error;
          }
        },

        fetchUserProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            console.log("Fetching user profile...");
            console.log(
              "Current access token for profile fetch:",
              get().accessToken
            );
            const profile = await authApi.getProfile();
            console.log("Profile fetched:", profile);
            set({
              userProfile: profile.data,
              isLoading: false,
            });
          } catch (error) {
            console.error("Fetch profile error:", error);
            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "프로필 정보를 가져오는데 실패했습니다.",
              userProfile: null,
            });
            throw error;
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
