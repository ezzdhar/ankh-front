import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";
import { Product } from "./useProducts";

const GUEST_ID_STORAGE_KEY = "ankh_guest_id";

function getFavoriteSessionScope() {
  if (typeof window === "undefined") {
    return "server";
  }

  const token = localStorage.getItem("token");
  if (token) {
    return `auth:${token.slice(0, 12)}`;
  }

  const guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  return guestId ? `guest:${guestId}` : "guest:anonymous";
}

export interface FavoriteItem {
  id: number;
  product: Product;
  created_at: string;
}

export function useFavorites(page = 1, perPage = 10) {
  const sessionScope = getFavoriteSessionScope();

  return useQuery<ApiResponse<FavoriteItem[]>>({
    queryKey: ["favorites", sessionScope, page, perPage],
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
    onSuccess: (data) => {
      toast.success(data.message || i18n.t("wishlist:toastSuccess"));
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
