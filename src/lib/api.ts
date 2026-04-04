import axios from "axios";
import i18n from "@/i18n";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.ankh-eg.com";
const GUEST_ID_STORAGE_KEY = "ankh_guest_id";

function getOrCreateGuestId() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedGuestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  if (storedGuestId) {
    return storedGuestId;
  }

  const generatedGuestId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(GUEST_ID_STORAGE_KEY, generatedGuestId);
  return generatedGuestId;
}

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
      "/reset-password",
    ];

    const guestHeaderEndpoints = ["/cart-items", "/checkout"];

    const needsCredentials = sessionEndpoints.some((ep) =>
      config.url?.includes(ep)
    );

    const needsGuestHeader =
      !token &&
      guestHeaderEndpoints.some((ep) => config.url?.includes(ep));

    if (needsGuestHeader) {
      const guestId = getOrCreateGuestId();
      if (guestId) {
        config.headers["X-Guest-Id"] = guestId;
      }
    }

    // Send credentials for session-driven guest flows on protected/session endpoints.
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
