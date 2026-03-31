import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";
import { Product } from "./useProducts";

export interface FavoriteItem {
  id: number;
  product: Product;
  created_at: string;
}

export function useFavorites(page = 1, perPage = 10) {
  return useQuery<ApiResponse<FavoriteItem[]>>({
    queryKey: ["favorites", page, perPage],
    queryFn: async () => {
      const response = await api.get<ApiResponse<FavoriteItem[]>>(
        "/api/v1/favorites",
        {
          params: { page, per_page: perPage },
        },
      );
      return response.data;
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    number | string
  >({
    mutationFn: async (productId: number | string) => {
      const formData = new FormData();
      formData.append("product_id", productId.toString());

      const response = await api.post<ApiResponse>(
        "/api/v1/favorites",
        formData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || i18n.t("errors.somethingWentWrong"),
      );
    },
  });
}
