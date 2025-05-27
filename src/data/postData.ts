export interface Post {
  id: number;
  title: string;
  tradeType: "sell" | "buy";
  category: string;
  modelNumber: string;
  modelName: string;
  brand: string;
  minPrice: number;
  description: string;
  quantity: number;
  images: string[];
  isScraped: boolean;
  author: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  isAuthor: boolean;
  defectAnswers: Record<string, string>;
  createdAt: string;
}

export const posts: Post[] = [
  {
    id: 1,
    title: "삼성 냉장고 판매합니다",
    tradeType: "sell",
    category: "refrigerator",
    modelNumber: "RF85B9120AP",
    modelName: "비스포크 냉장고",
    brand: "삼성",
    minPrice: 1500000,
    description: "2023년 구매한 냉장고입니다. 상태 좋습니다.",
    quantity: 1,
    images: [
      "/images/refrigerator1.jpg",
      "/images/refrigerator2.jpg",
    ],
    isScraped: false,
    author: {
      id: 1,
      nickname: "판매자1",
      profileImage: "/images/profile1.jpg",
    },
    isAuthor: false,
    defectAnswers: {
      "냉각 기능에 문제가 있나요?": "없습니다",
      "문이 제대로 닫히나요?": "네, 잘 닫힙니다",
      "내부 부품이 모두 있나요?": "네, 모두 있습니다",
    },
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: 2,
    title: "LG 세탁기 구매합니다",
    tradeType: "buy",
    category: "washer",
    modelNumber: "",
    modelName: "",
    brand: "",
    minPrice: 0,
    description: "LG 세탁기 구매 원합니다. 상태 좋은 것만 구매합니다.",
    quantity: 1,
    images: [],
    isScraped: false,
    author: {
      id: 2,
      nickname: "구매자1",
      profileImage: "/images/profile2.jpg",
    },
    isAuthor: false,
    defectAnswers: {},
    createdAt: "2024-03-15T11:00:00Z",
  },
  {
    id: 3,
    title: "삼성 TV 판매합니다",
    tradeType: "sell",
    category: "tv",
    modelNumber: "QN85QN90C",
    modelName: "Neo QLED 8K",
    brand: "삼성",
    minPrice: 3000000,
    description: "2023년 구매한 TV입니다. 상태 좋습니다.",
    quantity: 1,
    images: [
      "/images/tv1.jpg",
      "/images/tv2.jpg",
    ],
    isScraped: false,
    author: {
      id: 3,
      nickname: "판매자2",
      profileImage: "/images/profile3.jpg",
    },
    isAuthor: false,
    defectAnswers: {
      "화면에 문제가 있나요?": "없습니다",
      "소리가 정상적으로 나오나요?": "네, 잘 나옵니다",
      "리모컨이 정상 작동하나요?": "네, 잘 작동합니다",
    },
    createdAt: "2024-03-15T12:00:00Z",
  },
];
