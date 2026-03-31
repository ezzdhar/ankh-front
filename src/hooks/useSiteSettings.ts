import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  description: string;
  logo_white: string;
  logo_black: string;
  favicon: string;
  theme: string;
  about_us: string;
  privacy_policy: string;
  terms_and_conditions: string;
  refund_policy: string;
  shipping_policy: string;
  shipping_returns: string;
  google_client_id: string | null;
  google_client_secret: string | null;
  google_redirect_uri: string;
}

export function useSiteSettings() {
  return useQuery<ApiResponse<SiteSettings>>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SiteSettings>>(
        "/api/v1/site-settings",
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
