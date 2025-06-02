import { axiosInstance } from "@/lib/axios";

export interface Product {
  id: number;
  title: string;
  tradeType: "SELLING" | "BUYING";
  category: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  modelName: string;
  priceOrQuantity: number;
  description: string;
  isScraped: boolean;
  isAuthor: boolean;
  isActive: boolean;
  createdAt: string;
  memberId: number;
  scrapId?: number;
}

export interface ProductListResponse {
  status: number;
  code: string;
  message: string;
  data: Product[];
}

export interface CreateBuyingPostRequest {
  title: string;
  content: string;
  quantity: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  price: number;
}

export interface CreateBuyingPostResponse {
  status: number;
  code: string;
  message: string;
  data: {
    title: string;
    content: string;
    quantity: number;
    applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
    price: number;
    isActive: boolean;
  };
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  status: number;
  data: T;
}

export interface SellingPostDetail {
  title: string;
  content: string;
  isActive: boolean;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  modelName: string;
  modelNumber: string;
  brand: string;
  price: number;
  userPrice: number;
  answers: {
    id: number;
    questionId: number;
    questionContent: string;
    answerContent: string;
  }[];
}

export interface BuyingPostDetail {
  title: string;
  content: string;
  quantity: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  price: number;
  isActive: boolean;
}

export const getAllProducts = async (): Promise<ProductListResponse> => {
  console.log("Calling getAllProducts API...");
  const response = await axiosInstance.get("/product/all");
  console.log("getAllProducts response:", response);
  return response.data;
};

export const createBuyingPost = async (
  data: CreateBuyingPostRequest
): Promise<CreateBuyingPostResponse> => {
  const response = await axiosInstance.post("/product/buying", data);
  return response.data;
};

export const productApi = {
  getSellingPostDetail: async (
    productId: number
  ): Promise<SellingPostDetail> => {
    const response = await axiosInstance.get<ApiResponse<SellingPostDetail>>(
      `/product/selling/${productId}`
    );
    return response.data.data;
  },

  getBuyingPostDetail: async (productId: number): Promise<BuyingPostDetail> => {
    const response = await axiosInstance.get<ApiResponse<BuyingPostDetail>>(
      `/product/buying/${productId}`
    );
    return response.data.data;
  },
};
