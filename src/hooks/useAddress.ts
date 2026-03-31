import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";

export interface Address {
  id: number;
  city_id: number;
  city_name?: string;
  address_details: string;
  postal_code: string;
  is_default: boolean;
}

export interface City {
  id: number;
  name: string;
}

export interface CreateAddressData {
  city_id: string | number;
  address_details: string;
  postal_code: string;
  is_default: number; // 0 or 1
}

export interface UpdateAddressData {
  city_id: number;
  address_details: string;
  postal_code: string;
  is_default: boolean;
}

export function useAddresses(page = 1, per_page = 10) {
  return useQuery<ApiResponse<Address[]>>({
    queryKey: ["addresses", page, per_page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Address[]>>(
        "/api/v1/addresses",
        {
          params: { per_page, page },
        },
      );
      return response.data;
    },
  });
}

export function useCities() {
  return useQuery<ApiResponse<City[]>>({
    queryKey: ["cities"],
    queryFn: async () => {
      // Assuming /cities or /governorates exists
      const response = await api.get<ApiResponse<City[]>>("/api/v1/cities");
      return response.data;
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    CreateAddressData
  >({
    mutationFn: async (data: CreateAddressData) => {
      const formData = new FormData();
      formData.append("city_id", data.city_id.toString());
      formData.append("address_details", data.address_details);
      formData.append("postal_code", data.postal_code);
      formData.append("is_default", data.is_default.toString());

      const response = await api.post<ApiResponse>(
        "/api/v1/addresses",
        formData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(i18n.t("address:success.create"));
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useUpdateAddress(id: number | string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    UpdateAddressData
  >({
    mutationFn: async (data: UpdateAddressData) => {
      const response = await api.put<ApiResponse>(
        `/api/v1/addresses/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(i18n.t("address:success.update"));
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    number | string
  >({
    mutationFn: async (id: number | string) => {
      const response = await api.delete<ApiResponse>(`/api/v1/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success(i18n.t("address:success.delete"));
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
