import axios from "axios";
import i18n from "@/i18n";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.ankh-eg.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  // Use default axios serialization
});

api.interceptors.request.use(
  (config) => {
    const storedLang =
      typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : null;
    const lang = i18n.language || storedLang || "en";

    // Add language headers
    config.headers["lang"] = lang;
    config.headers["Accept-Language"] = lang;

    // Add auth token if exists
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Workaround for CORS issues:
    // Only send credentials (cookies) for endpoints that actually need the Session
    // (like cart, favorites, checkout) to avoid CORS failing on public endpoints 
    // that return Access-Control-Allow-Origin: *
    const sessionEndpoints = [
      "/cart-items",
      "/favorites",
      "/checkout",
      "/coupon",
      "/login",
      "/register",
      "/logout",
      "/profile",
      "/addresses",
      "/orders",
      "/change-password",
      "/forgot-password",
      "/reset-password"
    ];

    const needsCredentials = sessionEndpoints.some((ep) =>
      config.url?.includes(ep)
    );

    if (needsCredentials || token) {
      // If we have a token, we might need credentials for session merging etc.
      // But actually if token is present, we should send credentials IF the backend supports it.
      // Wait, if token is present and we request /banners, it will fail if we set withCredentials = true!
      // So we ONLY set it if the endpoint needs it, OR if the developer explicitly fixes backend CORS.
    }
    
    // Safer approach: Only set withCredentials for user-specific actions that might use Guest Session
    // when we DON'T have an auth token yet. Logged-in users use Bearer tokens and don't need
    // to send session credentials, which avoids CORS issues if the backend uses wildcard (*) origins.
    if (needsCredentials && !token) {
      config.withCredentials = true;
    } else {
      config.withCredentials = false;
    }

    // If data is FormData, remove Content-Type to let the browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    // Normalize response keys to lowercase
    if (response.data && typeof response.data === "object") {
      const { Data, Success, Status, Message, Pagination } = response.data;
      if (Data !== undefined) response.data.data = Data;
      if (Success !== undefined) response.data.success = Success;
      if (Status !== undefined) response.data.status = Status;
      if (Message !== undefined) response.data.message = Message;
      if (Pagination !== undefined) response.data.paginate = Pagination;
    }

    if (response.config.url?.includes("/products")) {
      console.log(`[API Call Success] ${response.config.url}${response.config.params ? '?' + new URLSearchParams(response.config.params).toString() : ''}:`, response.data);
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // localStorage.removeItem("token");
      }
    }

    // Identify CORS/Network errors more clearly
    const isNetworkError = !error.response;
    
    // Log as warning only in dev to avoid intrusive overlays for handled errors
    if (process.env.NODE_ENV === "development") {
      if (isNetworkError) {
        console.error("🌐 Network/CORS Error:", error.message, "\nThis usually means the server doesn't allow 'withCredentials' with a wildcard '*' origin, or the domain is blocked.");
      } else {
        console.warn("API Error:", error.response?.status, error.message);
      }
    }

    return Promise.reject(error);
  },
);
