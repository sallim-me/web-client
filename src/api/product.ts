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
  scrapId?: number;
}

export interface ProductListResponse {
  status: number;
  code: string;
  message: string;
  data: Product[];
}

export const getAllProducts = async (): Promise<ProductListResponse> => {
  console.log("Calling getAllProducts API...");
  const response = await axios.get("https://dev-back.sallim.me/product/all");
  console.log("getAllProducts response:", response);
  return response.data;
};
