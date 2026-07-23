// Phase 6 – Auth Module
// Public entry for the authentication module. LoginContext (the app's public
// auth interface) consumes these; there is no parallel screen/hook.
//   import { login, saveSession } from "@modules/auth";
export { login } from "./services/authService";
export {
  saveSession,
  loadSession,
  clearSession,
  getSelectedCostId,
  setSelectedCostId,
  saveEmployeeId,
  AUTH_KEYS,
} from "./services/authSession";
export { validateLoginForm } from "./utils/authValidation";
export type { LoginCredentials, LoginForm, CompanyData } from "./types/auth.types";
