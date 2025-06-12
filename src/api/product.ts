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

export interface CreateBuyingPostRequest {
  title: string;
  content: string;
  quantity: number;
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
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
  modelNumber: string;
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

export const createSellingPost = async (data: CreateSellingPostRequest, photos?: File[]) => {
  const formData = new FormData();
  
  // request 데이터를 JSON 문자열로 추가
  formData.append('request', JSON.stringify(data));
  
  // 사진 파일들 추가 (있는 경우)
  if (photos && photos.length > 0) {
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });
  } else {
    // 사진이 없는 경우 빈 photos 필드 추가
    formData.append('photos', '');
  }

  const response = await axiosInstance.post("/product/selling", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
};

export const getApplianceQuestions = async (
  applianceType: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER"
): Promise<ApplianceQuestionsResponse> => {
  const response = await axiosInstance.get(
    `/appliance-questions/${applianceType}`
  );
  return response.data;
};

export const updateSellingPost = async (
  productId: number,
  data: UpdateSellingPostRequest | FormData
) => {
  const response = await axiosInstance.patch(
    `/product/selling/${productId}`,
    data,
    {
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    }
  );
  return response.data;
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
export const analyzeImage = async (file: File): Promise<AnalyzeImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(
    '/ai/analyze-image?applyPreprocessing=true',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
