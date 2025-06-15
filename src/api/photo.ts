import { axiosInstance } from "@/lib/axios";

export interface Photo {
  id: number;
  productId: number;
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PhotoListResponse {
  status: number;
  code: string;
  message: string;
  data: Photo[];
}

const PHOTO_URL = "/api/v1/products";

export const photoApi = {
  // 상품 사진 목록 조회
  getProductPhotos: async (productId: number): Promise<PhotoListResponse> => {
    try {
      console.log("Fetching product photos for productId:", productId);
      const response = await axiosInstance.get<PhotoListResponse>(
        `${PHOTO_URL}/${productId}/photos`
      );
      console.log("Product photos response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get product photos error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  // 특정 사진 조회 (단일 사진)
  getProductPhoto: async (
    productId: number,
    photoId: number
  ): Promise<Photo> => {
    try {
      console.log("Fetching product photo:", { productId, photoId });
      const response = await axiosInstance.get<Photo>(
        `${PHOTO_URL}/${productId}/photos/${photoId}`
      );
      console.log("Product photo response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get product photo error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};

// 하위 호환성을 위한 legacy 함수 (deprecated)
export const getProductPhotos = async (productId: number): Promise<Photo[]> => {
  console.warn(
    "getProductPhotos is deprecated. Use photoApi.getProductPhotos instead."
  );
  const response = await photoApi.getProductPhotos(productId);
  return response.data;
};
