import axios from "axios";
import i18n from "@/i18n";

const API_BASE_URL = "https://admin.ankh-eg.com";

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

    // Log as warning only in dev to avoid intrusive overlays for handled errors
    if (process.env.NODE_ENV === "development") {
      console.warn("API Error:", error.response?.status, error.message);
    }

    return Promise.reject(error);
  },
);
