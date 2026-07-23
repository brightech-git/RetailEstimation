// Phase 6 – Auth Module
// Login service. Uses the Phase 3 API layer (axios + backendManager +
// endpoints) and the Phase 1 logger. Request payload and response handling are
// preserved exactly as the app does today.
import { api, ENDPOINTS, backendManager, type ApiError } from "@api";
import { logger } from "@core/logger";
import type { LoginCredentials, CompanyData } from "../types/auth.types";

/**
 * Authenticate against the AUTH backend.
 * - Payload is the same { username, password } sent today.
 * - On success, registers the per-company backend URL immediately, exactly
 *   like the current LoginContext (setCompanyUrl / companyUrl flow).
 * Throws an ApiError (from the response interceptor) on failure.
 */
export async function login(credentials: LoginCredentials): Promise<CompanyData> {
  const res = await api.post<CompanyData>(ENDPOINTS.AUTH.LOGIN, credentials, {
    useAuthBackend: true,
    timeout: 10000,
  });

  const data = res.data;

  if (data?.BASEURL) {
    backendManager.setCompanyUrl(data.BASEURL);
  }

  logger.info("login success", data?.COMPANYNAME ?? credentials.username);
  return data;
}

export type { ApiError };
