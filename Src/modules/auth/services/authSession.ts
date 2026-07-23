// Phase 6 – Auth Module
// Session persistence via the shared storage utility (Phase 5). No direct
// AsyncStorage access. Storage keys are preserved EXACTLY as used today so the
// migrated flow reads/writes the same data.
import { storage } from "@shared/utils";
import { backendManager } from "@api";
import type { CompanyData } from "../types/auth.types";

export const AUTH_KEYS = {
  COMPANY_DATA: "COMPANY_DATA",
  SELECTED_COST_ID: "SELECTED_COST_ID",
  EMPLOYEE_ID: "EMPLOYEE_ID",
} as const;

/** Persist the company session and register its backend URL. */
export async function saveSession(data: CompanyData): Promise<void> {
  await storage.set(AUTH_KEYS.COMPANY_DATA, data);
  if (data?.BASEURL) backendManager.setCompanyUrl(data.BASEURL);
}

/** Restore a persisted session (and re-register its backend URL). */
export async function loadSession(): Promise<CompanyData | null> {
  const data = await storage.get<CompanyData>(AUTH_KEYS.COMPANY_DATA);
  if (data?.BASEURL) backendManager.setCompanyUrl(data.BASEURL);
  return data;
}

/** Clear session data on logout (keys preserved). */
export async function clearSession(): Promise<void> {
  await storage.remove(AUTH_KEYS.COMPANY_DATA);
  await storage.remove(AUTH_KEYS.SELECTED_COST_ID);
  backendManager.clear();
}

export function getSelectedCostId(): Promise<string | null> {
  return storage.get<string>(AUTH_KEYS.SELECTED_COST_ID);
}

export async function setSelectedCostId(costId: string): Promise<void> {
  if (costId) await storage.set(AUTH_KEYS.SELECTED_COST_ID, costId);
  else await storage.remove(AUTH_KEYS.SELECTED_COST_ID);
}

export async function saveEmployeeId(employeeId: string): Promise<void> {
  await storage.set(AUTH_KEYS.EMPLOYEE_ID, employeeId);
}
