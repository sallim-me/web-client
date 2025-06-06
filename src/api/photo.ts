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

export const getProductPhotos = async (productId: number): Promise<Photo[]> => {
  try {
    const response = await axiosInstance.get<Photo[]>(`/api/v1/products/${productId}/photos`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product photos:", error);
    throw error;
  }
};

export const photoApi = {
  getProductPhotos,
};