import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiResponse, ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";
import i18n from "@/i18n";
import { useAuth } from "@/providers/AuthProvider";

interface UpdateProfileData {
  name: string;
  phone: string;
  phone_key: string;
  image?: File;
}

interface UpdatePasswordData {
  old_password: string;
  password: string;
  password_confirmation: string;
}

export function useProfile() {
  const router = useRouter();
  const { isAuthenticated, logout: authLogout } = useAuth();

  const getProfile = useQuery<ApiResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get<ApiResponse>("/api/v1/profile");
      return response.data;
    },
    retry: 1,
    enabled: isAuthenticated,
  });

  const updateProfile = useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    UpdateProfileData
  >({
    mutationFn: async (data: UpdateProfileData) => {
      const formData = new FormData();
      formData.append("name", data.name);

      // Clean phone number: remove the phone_key if it exists at the start
      let cleanPhone = data.phone.trim();
      if (data.phone_key && cleanPhone.startsWith(data.phone_key)) {
        cleanPhone = cleanPhone.substring(data.phone_key.length).trim();
      }

      formData.append("phone", cleanPhone);
      formData.append("phone_key", data.phone_key);
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await api.post<ApiResponse>(
        "/api/v1/profile/update",
        formData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      // Update local storage user if needed
      if (data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }
      // Invalidate query to refetch fresh data
      getProfile.refetch();
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message || i18n.t("errors:profile.updateFailed");
      toast.error(errorMsg);
    },
  });

  const updatePassword = useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    UpdatePasswordData
  >({
    mutationFn: async (data: UpdatePasswordData) => {
      const formData = new FormData();
      formData.append("old_password", data.old_password);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      const response = await api.post<ApiResponse>(
        "/api/v1/profile/update/password",
        formData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      // Optionally logout or just stay
      router.push("/profile");
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message ||
        i18n.t("errors:profile.updatePasswordFailed");
      toast.error(errorMsg);
    },
  });

  const logout = useMutation<ApiResponse, AxiosError<ApiErrorResponse>>({
    mutationFn: async () => {
      const response = await api.post<ApiResponse>("/api/v1/profile/logout");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      authLogout();
      router.push("/");
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message || i18n.t("errors:auth.logoutFailed");
      toast.error(errorMsg);
      // Force logout even on error
      authLogout();
      router.push("/");
    },
  });

  const deleteAccount = useMutation<ApiResponse, AxiosError<ApiErrorResponse>>({
    mutationFn: async () => {
      const response = await api.post<ApiResponse>(
        "/api/v1/profile/delete-account",
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
      authLogout();
      router.push("/");
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message ||
        i18n.t("errors:profile.deleteAccountFailed");
      toast.error(errorMsg);
    },
  });

  return {
    getProfile,
    updateProfile,
    updatePassword,
    logout,
    deleteAccount,
  };
}
