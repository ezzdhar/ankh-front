import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface CheckoutData {
  payment_gateway: "paymob" | "fawry" | "cod" | string;
  notes?: string;
  idempotency_key: string;
  // Authenticated user fields
  address_id?: number;
  // Guest fields
  guest_name?: string;
  guest_phone?: string;
  guest_address?: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckoutData) => {
      const payload: Record<string, unknown> = {
        payment_method: data.payment_gateway,
        payment_gateway: data.payment_gateway,
        notes: data.notes,
        idempotency_key: data.idempotency_key,
      };

      // Conditionally include either address_id OR guest fields
      if (data.address_id) {
        payload.address_id = data.address_id;
      } else {
        payload.guest_name = data.guest_name;
        payload.guest_phone = data.guest_phone;
        payload.guest_address = data.guest_address;
      }

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
