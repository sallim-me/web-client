import { axiosInstance } from "@/lib/axios";

export interface CreateChatRoomRequest {
  productId: number;
}

export interface CreateChatRoomResponse {
  status: number;
  code: string;
  message: string;
  data: {
    chatRoomId: number;
    productId: number;
    sellerId: number;
    buyerId: number;
  };
}

const CHAT_URL = "/chat";

export const chatApi = {
  createChatRoom: async (
    data: CreateChatRoomRequest
  ): Promise<CreateChatRoomResponse> => {
    try {
      const response = await axiosInstance.post<CreateChatRoomResponse>(
        `${CHAT_URL}/rooms`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Create chat room error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
  // 여기에 다른 채팅 관련 API 함수들을 추가할 수 있습니다.
};
