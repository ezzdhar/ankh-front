import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface InspiredItem {
  id: number;
  image: string;
  link: string;
}

export function useInspired() {
  return useQuery<ApiResponse<InspiredItem[]>>({
    queryKey: ["inspired"],
    queryFn: async () => {
      const response =
        await api.get<ApiResponse<InspiredItem[]>>("/api/v1/inspireds");
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
