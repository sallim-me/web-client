import { axiosInstance } from "@/lib/axios";

export interface Scrap {
  id: number;
  memberId: number;
  memberNickname: string;
  productId: number;
  title: string;
  productTitle: string;
  modelName: string;
  price: number;
  memo: string;
  createdAt: string;
  postType: "BUYING" | "SELLING";
  isActive: boolean;
  images: string[];
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

export interface AddScrapRequest {
  productId: number;
  memo?: string;
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

  // 스크랩 생성
  createScrap: async (data: AddScrapRequest): Promise<Scrap> => {
    const response = await axiosInstance.post(SCRAP_URL, data);
    return response.data;
  },

  // 스크랩 취소 (ID로 삭제)
  deleteScrap: async (scrapId: number): Promise<void> => {
    await axiosInstance.delete(`${SCRAP_URL}/${scrapId}`);
  },
};

export const checkScrap = async (productId: number): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/scrap/check/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error("Check scrap error:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    // API에서 스크랩되지 않은 경우 에러 응답을 줄 수도 있으므로 false 반환
    if (error.response?.status === 404) return false;
    throw error;
  }
};
