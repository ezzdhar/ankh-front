/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import i18n from "@/i18n";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import { useAuth } from "@/providers/AuthProvider";

interface LoginData {
  email?: string;
  phone?: string;
  phone_key?: string;
  password: string;
}

interface LoginResponse {
  data: {
    token: string;
    user: {
      email: string;
      id: number;
      image: string;
      name: string;
      phone: string;
      phone_key: string;
    };
  };
  message: string;
}

export function useLogin() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const formData = new FormData();
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.phone_key) formData.append("phone_key", data.phone_key);
      formData.append("password", data.password);

      const response = await api.post<LoginResponse>("/api/v1/login", formData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data?.token) {
        // Use AuthContext login — sets storage, cookies, and updates reactive state
        authLogin(data.data.token, data.data.user);
      }

      toast.success("Logged in successfully");
      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMsg =
        error.response?.data?.message || i18n.t("errors:auth.loginFailed");
      toast.error(errorMsg);
    },
  });
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await api.post("/api/v1/register", formData);
      return response.data;
    },
    onSuccess: (data: any, variables: RegisterData) => {
      toast.success("Account created successfully. Please verify your email.");
      router.push(`/otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMsg =
        error.response?.data?.message || i18n.t("errors:auth.registerFailed");
      toast.error(errorMsg);
    },
  });
}

interface VerifyCodeData {
  email: string;
  verification_code: string;
  isReset?: boolean;
}

export function useVerifyCode() {
  const { login: authLogin } = useAuth();

  return useMutation({
    mutationFn: async (data: VerifyCodeData) => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("verification_code", data.verification_code);

      const response = await api.post("/api/v1/verify-code", formData);
      return response.data;
    },
    onSuccess: (data: any, variables: VerifyCodeData) => {
      if (variables.isReset) {
        // Reset password flow: only store resetToken
        if (data.data?.token) {
          localStorage.setItem("resetToken", data.data.token);
        }
      } else {
        // Normal verify flow: use AuthContext login
        if (data.data?.token) {
          authLogin(data.data.token, data.data.user);
        }
      }

      toast.success("Account verified successfully!");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMsg =
        error.response?.data?.message || i18n.t("errors:auth.verifyCodeFailed");
      toast.error(errorMsg);
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (email: string) => {
      const formData = new FormData();
      formData.append("email", email);

      const response = await api.post("/api/v1/send/code", formData);
      return response.data;
    },
    onSuccess: (data: any, email: string) => {
      toast.success("Verification code sent to your email");
      router.push(`/reset-password/verify?email=${encodeURIComponent(email)}`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMsg =
        error.response?.data?.message || i18n.t("errors:auth.sendCodeFailed");
      toast.error(errorMsg);
    },
  });
}

interface ResetPasswordData {
  email?: string;
  password: string;
  password_confirmation: string;
}

export function useResetPassword() {
  const router = useRouter();
  const { logout: authLogout } = useAuth();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const formData = new FormData();
      if (data.email) formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      const resetToken = localStorage.getItem("resetToken");
      if (resetToken) {
        formData.append("token", resetToken);
      }

      const response = await api.post("/api/v1/reset/password", formData, {
        headers: {
          Authorization: resetToken ? `Bearer ${resetToken}` : undefined,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully. Please login.");
      localStorage.removeItem("resetToken");
      authLogout();
      router.push("/login");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMsg =
        error.response?.data?.message ||
        i18n.t("errors:auth.resetPasswordFailed");
      toast.error(errorMsg);
    },
  });
}
