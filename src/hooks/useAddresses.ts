import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface Address {
  id: number;
  user_id: number;
  city_id: number;
  city: string;
  address_details: string;
  postal_code: string;
  is_default: boolean;
}

export function useAddresses() {
  return useQuery<ApiResponse<Address[]>>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response =
        await api.get<ApiResponse<Address[]>>("/api/v1/addresses");
      return response.data;
    },
  });
}
