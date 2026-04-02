import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";

export interface Review {
  id: number;
  product_id: number;
  rating: number;
  comment: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  created_at: string;
}

export interface ReviewsPaginatedData extends Array<Review> {}
// Actually, ApiResponse<Review[]> is what we want.

export interface StoreReviewData {
  product_id: number | string;
  comment: string;
  rating: number | string;
  image?: File;
}

export function useReviews(productId: number | string, perPage = 6) {
  return useQuery<ApiResponse<Review[]>>({
    queryKey: ["reviews", productId, perPage],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Review[]>>(
        "/api/v1/products/reviews",
        {
          params: { 
            product_id: productId,
            per_page: perPage
          },
        },
      );
      return response.data;
    },
    enabled: !!productId,
  });
}

export function useStoreReview() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    StoreReviewData
  >({
    mutationFn: async (data: StoreReviewData) => {
      const formData = new FormData();
      formData.append("product_id", data.product_id.toString());
      formData.append("comment", data.comment);
      formData.append("rating", data.rating.toString());
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await api.post<ApiResponse>("/api/v1/reviews", formData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(i18n.t("product:reviews.success"));
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.product_id],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || i18n.t("errors.somethingWentWrong"),
      );
    },
  });
}
