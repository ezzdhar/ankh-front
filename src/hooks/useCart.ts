import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { toast } from "sonner";
import i18n from "@/i18n";

export interface CartItem {
  id: number;
  product_id: number;
  product_variant_id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  product: {
    id: number;
    name: string;
    image: string;
    main_image?: string;
    images: { url: string }[];
    price: number;
    original_price?: number;
    slug?: string;
  };
  product_variant: {
    id: number;
    name: string | null;
    color_code?: string;
    size_name: string | null;
    price?: string;
  };
}

export interface CartData {
  items: CartItem[];
  sub_total: string;
  tax_amount: string;
  discount_amount: string;
  shipping_cost: string;
  total: string;
  coupon_code: string | null;
}

export function useCart() {
  return useQuery<ApiResponse<CartData>>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response =
        await api.get<ApiResponse<CartData>>("/api/v1/cart-items");
      return response.data;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      product_id: number;
      product_variant_id?: number;
      quantity: number;
    }) => {
      const formData = new FormData();
      formData.append("product_id", data.product_id.toString());
      if (data.product_variant_id) {
        formData.append(
          "product_variant_id",
          data.product_variant_id.toString(),
        );
      }
      formData.append("quantity", data.quantity.toString());

      const response = await api.post<ApiResponse>(
        "/api/v1/cart-items",
        formData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(i18n.t("common:cart.addedSuccess"));
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await api.put<ApiResponse>(`/api/v1/cart-items/${id}`, {
        quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<ApiResponse>(
        `/api/v1/cart-items/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(i18n.t("common:cart.removedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<ApiResponse>(
        "/api/v1/cart-items/clear",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coupon_code: string) => {
      const formData = new FormData();
      formData.append("coupon_code", coupon_code);

      const response = await api.post<ApiResponse>(
        "/api/v1/coupon/apply",
        formData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(i18n.t("common:cart.couponApplied"));
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        toast.error(data.message || i18n.t("common:cart.couponError"));
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(
        error.response?.data?.message || i18n.t("common:cart.couponError"),
      );
    },
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<ApiResponse>("/api/v1/coupon/remove");
      return response.data;
    },
    onSuccess: () => {
      toast.success(i18n.t("common:cart.couponRemoved"));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
