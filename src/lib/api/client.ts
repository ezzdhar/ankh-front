import axios, { InternalAxiosRequestConfig } from "axios";

// API Base URL - will come from environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// API Key for protection
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add headers to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get current language from localStorage or default to 'en'
    const currentLang =
      typeof window !== "undefined"
        ? localStorage.getItem("i18nextLng") || "en"
        : "en";

    // Set language header
    config.headers["Accept-Language"] = currentLang;

    // Set API key header for protection
    if (API_KEY) {
      config.headers["X-API-Key"] = API_KEY;
    }

    // Set Authorization token if exists
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        // You can add redirect logic here if needed
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

// Helper types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}
