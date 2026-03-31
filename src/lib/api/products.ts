import { api } from "../api";
import { ProductSearchParams, ProductsResponse } from "@/types/product";

export const getProducts = async (
  params: ProductSearchParams,
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>("/api/v1/products", {
    params,
  });
  return data;
};
