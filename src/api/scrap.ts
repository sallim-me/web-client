import { axiosInstance } from "@/lib/axios";

// 서버 API에서 실제로 반환하는 스크랩 데이터 구조
export interface ScrapApiResponse {
  id: number;
  memberId: number;
  memberNickname: string;
  productId: number;
  productTitle: string;
  productPrice: number;
  thumbnailUrl: string | null; // 썸네일 URL이 없을 수도 있으므로 nullable 처리
  memo: string | null;
  createdAt: string;
  postType: "BUYING" | "SELLING";
}

// 클라이언트에서 사용하는 스크랩 데이터 구조
export interface Scrap {
  id: number;
  memberId: number;
  memberNickname: string;
  productId: number;
  title: string;
  productTitle: string;
  productPrice: number;
  thumbnailUrl: string | null; // 썸네일 URL이 없을 수도 있으므로 nullable 처리
  memo: string | null;
  createdAt: string;
  postType: "BUYING" | "SELLING";
  isActive: boolean;
}

export interface GetScrapsApiResponse {
  scraps: ScrapApiResponse[];
  totalPages: number;
  totalElements: number;
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
      const response = await axiosInstance.get<GetScrapsApiResponse>(
        SCRAP_URL,
        {
          params: {
            page: params?.page ?? 0,
            size: params?.size ?? 10,
            sort: params?.sort ?? "createdAt,desc",
          },
        }
      );

      // API 응답 데이터를 클라이언트에서 사용할 수 있도록 변환
      const transformedScraps: Scrap[] = response.data.scraps.map((scrap) => ({
        ...scrap,
        title: scrap.productTitle,
        memo: scrap.memo || "", // null인 경우 빈 문자열로 변환
        isActive: true,
      }));

      return {
        scraps: transformedScraps,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      };
    } catch (error: any) {
      console.error("Get scraps error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 스크랩 생성
  createScrap: async (data: AddScrapRequest): Promise<ScrapApiResponse> => {
    console.log("Creating scrap for productId:", data.productId);
    const response = await axiosInstance.post<ScrapApiResponse>(
      SCRAP_URL,
      data
    );
    console.log("Scrap created successfully:", response.data);
    return response.data;
  },

  // 스크랩 취소 (ID로 삭제)
  deleteScrap: async (scrapId: number): Promise<void> => {
    console.log("Deleting scrap with scrapId:", scrapId);
    await axiosInstance.delete(`${SCRAP_URL}/${scrapId}`);
    console.log("Scrap deleted successfully");
  },

  // productId로 스크랩 삭제 (내부적으로 scrapId를 찾아서 삭제)
  deleteScrapByProductId: async (productId: number): Promise<void> => {
    try {
      await scrapApi.deleteScrap(productId);
      // const scraps = await scrapApi.getScraps();
      // const targetScrap = scraps.scraps.find(scrap => scrap.productId === productId);
      // if (targetScrap) {
      //   await scrapApi.deleteScrap(targetScrap.id);
      // } else {
      //   throw new Error(`Scrap not found for productId: ${productId}`);
      // }
    } catch (error) {
      console.error("Error deleting scrap by productId:", error);
      throw error;
    }
  },
};

export const checkScrap = async (productId: number): Promise<boolean> => {
  try {
    console.log("Checking scrap status for productId:", productId);
    const response = await axiosInstance.get(`/scrap/check/${productId}`);
    console.log("Scrap check response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Check scrap error:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    // API에서 스크랩되지 않은 경우 에러 응답을 줄 수도 있으므로 false 반환
    if (error.response?.status === 404) {
      console.log("Scrap not found (404), returning false");
      return false;
    }
    throw error;
  }
};

// productId로 스크랩 정보 조회 (스크랩 ID와 상태를 함께 반환)
export const getScrapByProductId = async (
  productId: number
): Promise<{ isScraped: boolean; scrapId: number | null }> => {
  try {
    // 먼저 checkScrap으로 빠른 확인
    const isScraped = await checkScrap(productId);
    if (!isScraped) {
      return { isScraped: false, scrapId: null };
    }

    // 스크랩되어 있다면 스크랩 목록에서 scrapId 찾기
    try {
      const scraps = await scrapApi.getScraps({ page: 0, size: 100 }); // 충분한 수의 스크랩을 가져옴
      const targetScrap = scraps.scraps.find(
        (scrap) => scrap.productId === productId
      );

      if (targetScrap) {
        return { isScraped: true, scrapId: targetScrap.id };
      } else {
        // checkScrap에서는 true였지만 목록에서 찾을 수 없는 경우
        console.warn(
          `checkScrap returned true but scrap not found in list for productId: ${productId}`
        );
        return { isScraped: true, scrapId: null };
      }
    } catch (listError) {
      console.error("Error fetching scrap list:", listError);
      // 목록 조회 실패 시에도 스크랩 상태는 유지
      return { isScraped: true, scrapId: null };
    }
  } catch (error: any) {
    console.error("Error getting scrap by productId:", error);
    if (error.response?.status === 401) {
      throw error; // 인증 오류는 상위로 전파
    }
    return { isScraped: false, scrapId: null };
  }
};
