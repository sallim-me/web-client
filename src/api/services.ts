import api from "./axios";
import { ApiResponse, PaginatedResponse } from "./types";

// GET 요청
export const get = async <T>(
  url: string,
  params?: any
): Promise<ApiResponse<T>> => {
  const response = await api.get(url, { params });
  return response.data;
};

// POST 요청
export const post = async <T>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> => {
  const response = await api.post(url, data);
  return response.data;
};

// PUT 요청
export const put = async <T>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> => {
  const response = await api.put(url, data);
  return response.data;
};

// DELETE 요청
export const del = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.delete(url);
  return response.data;
};

// 페이지네이션 GET 요청
export const getPaginated = async <T>(
  url: string,
  params?: any
): Promise<PaginatedResponse<T>> => {
  const response = await api.get(url, { params });
  return response.data;
};
