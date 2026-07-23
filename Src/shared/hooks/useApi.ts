// Phase 5 – Shared Hooks
// Runs a request through the Phase 3 axios instance and tracks
// loading/error/data. No business logic — the caller supplies the request
// config (url from ENDPOINTS, params, method, and { auth: true } for login).
import { useState, useCallback } from "react";
import type { AxiosRequestConfig } from "axios";
import { api, type ApiError } from "@api";
import { logger } from "@core/logger";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (config: AxiosRequestConfig): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const res = await api.request<T>(config);
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (e) {
      const error = e as ApiError;
      logger.error("useApi request failed", error.message);
      setState({ data: null, loading: false, error });
      return null;
    }
  }, []);

  const reset = useCallback(
    () => setState({ data: null, loading: false, error: null }),
    []
  );

  return { ...state, request, reset };
}
