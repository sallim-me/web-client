import { axiosInstance } from "@/lib/axios";

export interface Scrap {
  id: number;
  memberId: number;
  memberNickname: string;
  productId: number;
  productTitle: string;
  memo: string;
  createdAt: string;
  postType: "BUYING" | "SELLING";
  isActive: boolean;
  minPrice?: number;
  images?: string[];
  modelName?: string;
}

export interface GetScrapsResponse {
  scraps: Scrap[];
  totalPages: number;
  totalElements: number;
}

export interface GetScrapsParams {
  page?: number;
  size?: number;
  sort?: string;
}

const SCRAP_URL = "/scrap";

export const scrapApi = {
  // 스크랩 목록 조회
  getScraps: async (params?: GetScrapsParams): Promise<GetScrapsResponse> => {
    try {
      const response = await axiosInstance.get<GetScrapsResponse>(SCRAP_URL, {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          sort: params?.sort ?? "createdAt,desc",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Get scraps error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 스크랩 취소
  deleteScrap: async (productId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`${SCRAP_URL}/${productId}`);
    } catch (error: any) {
      console.error("Delete scrap error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};
