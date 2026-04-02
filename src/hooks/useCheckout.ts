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
      // Use regular object for JSON payload, many backends prefer it for non-file requests
      const payload = {
        address_id: data.address_id,
        payment_method: data.payment_gateway, // Use payment_method as suggested by useOrders.ts
        payment_gateway: data.payment_gateway, 
        notes: data.notes,
        idempotency_key: data.idempotency_key,
      };

      const response = await api.post<ApiResponse>(
        "/api/v1/checkout",
        payload,
        {
          headers: {
            "Idempotency-Key": data.idempotency_key,
          },
        },
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
