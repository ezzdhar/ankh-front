import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface Category {
  id: number;
  name: string;
  image: string;
  count_products?: number;
}

export interface AttributeValue {
  id: number;
  attribute: {
    id: number;
    name: string;
  };
  name: string; // e.g. "Red", "Wood", "XL"
  color_code?: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  is_default: boolean;
  price: string;
  stock: number;
  reserved_stock?: number;
  image: string | null;
  attribute_values: AttributeValue[];
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  image: string;
  main_image?: string;
  images?: Array<{ id: number; url: string }>;
  price: string;
  price_after_discount?: string;
  discount_percentage?: string | number;
  has_discount?: boolean;
  category?: { id: number; name: string };
  category_name?: string;
  brand?: { id: number; name: string };
  room?: { id: number; name: string };
  sku?: string;
  stock?: number;
  is_favorited?: boolean;
  size_chart?: string;
  variants?: ProductVariant[];
  average_rating?: number;
  reviews_count?: number;
}

export function useCategories(page = 1, per_page = 10) {
  return useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories", page, per_page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category[]>>(
        "/api/v1/categories",
        {
          params: {
            page,
            per_page,
          },
        },
      );
      return response.data;
    },
  });
}

export interface ProductParams {
  category_id?: number | string;
  is_new?: number | boolean;
  page?: number | string;
  per_page?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  rating?: number | string;
  [key: string]: string | number | boolean | undefined | null;
}

export function useProducts(params?: ProductParams) {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>(
        "/api/v1/products",
        {
          params,
        },
      );
      return response.data;
    },
  });
}

export function useRandomProducts() {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ["products", "random"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>(
        "/api/v1/products/random",
      );
      return response.data;
    },
  });
}

export function useProduct(idOrSlug: string | number) {
  return useQuery<ApiResponse<Product>>({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product>>(
        `/api/v1/products/${idOrSlug}`,
      );
      return response.data;
    },
    enabled: !!idOrSlug,
  });
}
