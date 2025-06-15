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
  thumbnailUrl: string;
  modelName: string;
  price: number;
  postType: "SELLING" | "BUYING";
  priceOrQuantity: number;
  isActive: boolean;
  createdAt: string;
}

export interface GetMyPostsResponse {
  status: number;
  code: string;
  message: string;
  data: MyPost[];
}

// 회원 정보 조회 응답 타입
export interface MemberInfo {
  memberId: number;
  username: string;
  name: string;
  nickname: string;
  isBuyer: boolean;
}

export interface GetMemberResponse {
  status: number;
  code: string;
  message: string;
  data: MemberInfo;
}

// 내 프로필 정보 조회 응답 타입
export interface GetMyProfileResponse {
  status: number;
  code: string;
  message: string;
  data: {
    username: string;
    name: string;
    nickname: string;
    isBuyer: boolean;
  };
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

  // 특정 회원 정보 조회
  getMember: async (memberId: number): Promise<GetMemberResponse> => {
    try {
      const response = await axiosInstance.get<GetMemberResponse>(
        `${MEMBER_URL}/${memberId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get member info error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // 내 프로필 정보 조회
  getMyProfile: async (): Promise<GetMyProfileResponse> => {
    try {
      const response = await axiosInstance.get<GetMyProfileResponse>(
        `${MEMBER_URL}/me`
      );
      return response.data;
    } catch (error: any) {
      console.error("Get my profile error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};
