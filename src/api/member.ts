import { axiosInstance } from "@/lib/axios";

// 회원 정보 수정 요청 타입
export interface EditProfileRequest {
  username: string;
  name: string;
  password: string;
  nickname: string;
  isBuyer: boolean;
}

// 회원 정보 수정 응답 타입
export interface EditProfileResponse {
  status: number;
  code: string;
  message: string;
  data: Record<string, never>; // 빈 객체 반환
}

// 내가 쓴 글 응답 타입
export interface MyPost {
  productId: number;
  title: string;
  modelName: string;
  price: number;
  postType: string;
  isActive: boolean;
  createdAt: string;
}

export interface GetMyPostsResponse {
  status: number;
  code: string;
  message: string;
  data: MyPost[];
}

const MEMBER_URL = "/member";

export const memberApi = {
  // 회원 정보 수정 (PATCH 메서드 사용)
  editProfile: async (
    data: EditProfileRequest
  ): Promise<EditProfileResponse> => {
    try {
      console.log("Editing profile with data:", data);
      // PUT 대신 PATCH 메서드 사용
      const response = await axiosInstance.patch<EditProfileResponse>(
        `${MEMBER_URL}/profile`,
        data
      );
      console.log("Profile edit response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Edit profile error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  // 내가 쓴 글 목록 조회
  getMyPosts: async (): Promise<GetMyPostsResponse> => {
    try {
      const response = await axiosInstance.get<GetMyPostsResponse>(
        `${MEMBER_URL}/me/posts`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get my posts error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};
