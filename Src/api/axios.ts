// Phase 3 – API Foundation
// A single reusable Axios instance shared by (future) services.
//
// Base URL is chosen per request:
//   - pass { auth: true } for login  -> uses the AUTH backend
//   - default (no flag)              -> uses the per-company backend
//
// No token refresh, no retry, no upload/download helpers — intentionally simple.
import axios, { AxiosError, type AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backendManager } from "./backendManager";
import { APP_CONFIG } from "../app/config/appConfig";
import { logger } from "../core/logger";

// Allow a custom flag on any request to target the auth backend.
declare module "axios" {
  export interface AxiosRequestConfig {
    useAuthBackend?: boolean;
  }
}

/** Normalized error shape that services can rely on. */
export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

function normalizeError(error: AxiosError): ApiError {
  // Server responded with a non-2xx status.
  if (error.response) {
    const data = error.response.data as { message?: string } | undefined;
    return {
      message: data?.message || error.message || "Request failed",
      status: error.response.status,
      data: error.response.data,
    };
  }
  // Request was made but no response (offline / timeout / DNS).
  if (error.request) {
    return { message: "Network error — please check your connection" };
  }
  // Something failed while setting up the request.
  return { message: error.message || "Unexpected error" };
}

export const api: AxiosInstance = axios.create({
  timeout: APP_CONFIG.defaultTimeoutMs,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --- Request interceptor: pick the backend base URL + auto-inject costId & companyId ---
api.interceptors.request.use(async (config) => {
  const baseUrl = config.useAuthBackend
    ? backendManager.getAuthUrl()
    : backendManager.getCompanyUrl();

  if (!baseUrl) {
    logger.error("API base URL missing", { url: config.url, useAuthBackend: config.useAuthBackend });
    return Promise.reject<never>({
      message: "API base URL not set — user is not logged in yet",
    } as ApiError);
  }

  config.baseURL = baseUrl;

  // Auto-inject costId and companyId into every request if available
  const costId = await AsyncStorage.getItem("SELECTED_COST_ID");
  const companyId = await AsyncStorage.getItem("SELECTED_COMPANY_ID");

  if (costId || companyId) {
    const method = (config.method || "").toLowerCase();
    if (method === "get") {
      config.params = {
        ...(costId ? { costId } : {}),
        // ...(companyId ? { companyId } : {}),
        ...config.params,
      };
    } else {
      config.data = {
        ...(costId ? { costId } : {}),
        ...(companyId ? { companyId } : {}),
        ...(config.data || {}),
      };
    }
  }

  return config;
});

// --- Response interceptor: pass data through, normalize + log errors ---
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalized = normalizeError(error);
    logger.error("API request failed", normalized.message, {
      status: normalized.status,
      url: error.config?.url,
    });
    return Promise.reject(normalized);
  }
);
