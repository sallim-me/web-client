import { axiosInstance } from "@/lib/axios";

export interface Product {
  id: number;
  title: string;
  tradeType: "SELLING" | "BUYING";
  category: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  modelName: string;
  price: number | null;
  quantity: number | null;
  description: string;
  isScraped: boolean;
  isAuthor: boolean;
  isActive: boolean;
  createdAt: string;
  memberId: number;
  scrapId?: number;
  thumbnailUrl: string;
}

export interface ProductListResponse {
  status: number;
  code: string;
  message: string;
  data: Product[];
}

export interface GetAllProductsParams {
  categories?: string[];
  tradeTypes?: Array<"SELLING" | "BUYING">;
  isActive?: boolean;
  searchQuery?: string;
}

export interface CreateBuyingPostRequest {
  title: string;
  content: string;
  quantity: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  isActive: boolean;
}

export interface CreateBuyingPostResponse {
  status: number;
  code: string;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    quantity: number;
    applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
    isActive: boolean;
  };
}

export interface CreateSellingPostResponse {
  status: number;
  code: string;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
    modelName: string;
    modelNumber: string;
    brand: string;
    price: number;
    userPrice: number;
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
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  modelName: string;
  modelNumber: string;
  brand: string;
  price: number;
  userPrice: number;
  memberId: number;
  isAuthor: boolean;
  images: string[];
  answers: {
    id: number;
    questionId: number;
    questionContent: string;
    answerContent: string;
  }[];
  nickname: string;
}

export interface BuyingPostDetail {
  id: number;
  title: string;
  content: string;
  quantity: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  isActive: boolean;
  memberId: number;
  buyerNickname: string;
  buyerId: number;
  isAuthor: boolean;
}

interface SellingPostAnswer {
  questionId: number;
  answerContent: string;
}

interface CreateSellingPostRequest {
  title: string;
  content: string;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  modelNumber: string;
  modelName: string;
  brand: string;
  price: number;
  userPrice: number;
  answers: SellingPostAnswer[];
}

interface ApplianceQuestion {
  id: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  questionContent: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ApplianceQuestionsResponse {
  status: number;
  code: string;
  message: string;
  data: ApplianceQuestion[];
}

// AI 이미지 분석 API 인터페이스 추가
export interface AnalyzeImageResponse {
  title: string;
  category: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  brand: string;
  price: number;
  description: string;
  success: boolean;
  model_code: string;
  processing_time: number;
}

export interface UpdateSellingPostRequest {
  title: string;
  content: string;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  isActive: boolean;
  modelName: string;
  brand: string;
  price: number;
  userPrice: number;
  answers: {
    questionId: number;
    answerContent: string;
  }[];
  images?: string[];
  existingImages?: string[];
}

export interface UpdateBuyingPostRequest {
  title: string;
  content: string;
  quantity: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  isActive: boolean;
}

export const getAllProducts = async (
  params?: GetAllProductsParams
): Promise<ProductListResponse> => {
  console.log("Calling getAllProducts API with params:", params);
  const response = await axiosInstance.get<ProductListResponse>(
    "/product/all",
    {
      params: {
        category: params?.categories?.join(","),
        tradeType: params?.tradeTypes?.join(","),
        isActive: params?.isActive,
        search: params?.searchQuery,
      },
      paramsSerializer: (p) => {
        const sp = new URLSearchParams();
        for (const key in p) {
          if (p[key] !== undefined && p[key] !== null) {
            if (Array.isArray(p[key])) {
              p[key].forEach((item: string) => sp.append(key, item));
            } else {
              sp.append(key, p[key]);
            }
          }
        }
        return sp.toString();
      },
    }
  );
  console.log("getAllProducts response:", response);
  return response.data;
};

export const createBuyingPost = async (
  data: CreateBuyingPostRequest
): Promise<CreateBuyingPostResponse> => {
  const response = await axiosInstance.post("/product/buying", data);
  return response.data;
};

export const createSellingPost = async (
  data: CreateSellingPostRequest,
  photos?: File[]
): Promise<CreateSellingPostResponse> => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  photos?.forEach((photo) => {
    formData.append("photos", photo);
  });

  const response = await axiosInstance.post("/product/selling", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

  deletePost: async (productId: number) => {
    const response = await axiosInstance.delete(`/product/${productId}`);
    return response.data;
  },

  deleteSellingPost: (productId: number) =>
    axiosInstance.delete(`/product/selling/${productId}`),

  updateBuyingPost: async (
    productId: number,
    data: UpdateBuyingPostRequest
  ) => {
    const response = await axiosInstance.patch(
      `/product/buying/${productId}`,
      data
    );
    return response.data;
  },

  deleteBuyingPost: (productId: number) =>
    axiosInstance.delete(`/product/buying/${productId}`),

  createComment: async (
    productId: number,
    data: CreateCommentRequest
  ): Promise<ApiResponse<CreateCommentResponseData>> => {
    const response = await axiosInstance.post<
      ApiResponse<CreateCommentResponseData>
    >(`/product/comment/${productId}`, data);
    return response.data;
  },

  getComments: async (productId: number): Promise<GetCommentsResponse> => {
    const response = await axiosInstance.get<GetCommentsResponse>(
      `/product/comment/${productId}/comments`
    );
    return response.data;
  },

  deleteComment: async (commentId: number) => {
    const response = await axiosInstance.delete(
      `/product/comment/${commentId}`
    );
    return response.data;
  },

  updateSellingPost: async (
    productId: number,
    data: UpdateSellingPostRequest,
    newPhotos?: File[],
    deletedImageUrls?: string[]
  ): Promise<ApiResponse<any>> => {
    // 이미지가 있는 경우에만 FormData 사용
    if (newPhotos && newPhotos.length > 0) {
      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      newPhotos.forEach((photo) => {
        formData.append("newPhotos", photo);
      });
      if (deletedImageUrls && deletedImageUrls.length > 0) {
        formData.append("deletedImageUrls", JSON.stringify(deletedImageUrls));
      }
      const response = await axiosInstance.patch(
        `/product/selling/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } else {
      // 이미지가 없는 경우 JSON으로 전송
      const response = await axiosInstance.patch(
        `/product/selling/${productId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          transformRequest: [(data) => JSON.stringify(data)],
        }
      );
      return response.data;
    }
  },
};

export const getApplianceQuestions = async (
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER"
): Promise<ApplianceQuestionsResponse> => {
  const { data } = await axiosInstance.get<ApplianceQuestionsResponse>(
    `/appliance-questions/${applianceType}`
  );
  return data;
};

// Define interfaces for comment creation
export interface CreateCommentRequest {
  content: string;
}

export interface CreateCommentResponseData {
  commentId: number;
  memberId: number;
  nickname: string;
  content: string;
}

export interface GetCommentsResponse {
  status: number;
  code: string;
  message: string;
  data: CreateCommentResponseData[];
}

// AI 이미지 분석 API 함수
export const analyzeImage = async (
  file: File
): Promise<AnalyzeImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    "/ai/analyze-image?applyPreprocessing=true",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
