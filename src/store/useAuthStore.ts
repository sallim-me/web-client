import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authApi } from '@/api/auth';
import { LoginRequest } from '@/types/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthStore extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  reissueToken: () => Promise<void>;
  clearError: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      ...initialState,

      login: async (data: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.login(data);
          set({
            accessToken: response['access-token'],
            refreshToken: response['refresh-token'],
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await authApi.logout();
          set(initialState);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.',
            isLoading: false,
          });
          set(initialState);
          throw error;
        }
      },

      reissueToken: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.reissue();
          set({
            accessToken: response.data['access-token'],
            refreshToken: response.data['refresh-token'],
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '토큰 갱신 중 오류가 발생했습니다.',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
); 