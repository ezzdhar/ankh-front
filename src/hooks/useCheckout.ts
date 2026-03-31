import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface CheckoutData {
  address_id: number;
  payment_gateway: "paymob" | "fawry" | string;
  notes?: string;
  idempotency_key: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckoutData) => {
      const formData = new FormData();
      formData.append("address_id", data.address_id.toString());
      formData.append("payment_gateway", data.payment_gateway);
      if (data.notes) formData.append("notes", data.notes);
      formData.append("idempotency_key", data.idempotency_key);

      const response = await api.post<ApiResponse>(
        "/api/v1/checkout",
        formData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
    },
  });
}
