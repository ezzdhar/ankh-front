import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface Banner {
  id: number;
  image: string;
  name: string;
  description?: string;
  product_id?: number | null;
  sort?: number | null;
  status?: string;
}

export function useBanners() {
  return useQuery<ApiResponse<Banner[]>>({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Banner[]>>("/api/v1/banners");
      return response.data;
    },
  });
}
