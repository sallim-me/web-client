import { useAuthStore } from "@/store/useAuthStore";

export const getToken = (): string | null => {
  return useAuthStore.getState().accessToken;
};

export const refreshToken = async (): Promise<string> => {
  await useAuthStore.getState().reissueToken();
  const newToken = useAuthStore.getState().accessToken;
  if (!newToken) {
    throw new Error("Token refresh failed");
  }
  return newToken;
};
