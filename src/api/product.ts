import axios from "axios";

export interface Product {
  id: number;
  title: string;
  tradeType: "SELLING" | "BUYING";
  category: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER";
  modelName: string;
  priceOrQuantity: string;
  description: string;
  isScraped: boolean;
  isAuthor: boolean;
  createdAt: string;
  memberId: number;
}

export interface ProductListResponse {
  status: number;
  code: string;
  message: string;
  data: Product[];
}

export const getAllProducts = async (): Promise<ProductListResponse> => {
  const response = await axios.get("https://dev-back.sallim.me/product/all");
  return response.data;
};
