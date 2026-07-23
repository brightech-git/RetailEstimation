// Phase 3 – API Foundation
// Holds ONLY backend URLs. No tokens, no business data.
//
// - Auth URL is fixed (from environment.ts) and known before login.
// - Company URL is set after login (from the login response's BASEURL) and
//   used for every business API. This mirrors the app's existing flow exactly.
import { ENV } from "../app/config/environment";

let companyUrl: string | null = null;

export const backendManager = {
  /** Authentication server base URL (used only for login). */
  getAuthUrl(): string {
    return ENV.authBaseUrl;
  },

  /** Set the per-company base URL after login (pass the login response BASEURL). */
  setCompanyUrl(url: string | null | undefined): void {
    companyUrl = url && url.trim() ? url.trim() : null;
  },

  /** Current per-company base URL, or null if not logged in yet. */
  getCompanyUrl(): string | null {
    return companyUrl;
  },

  /** Reset the company URL (call on logout). */
  clear(): void {
    companyUrl = null;
  },
};

export type BackendManager = typeof backendManager;
