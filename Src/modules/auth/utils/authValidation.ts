// Phase 6 – Auth Module
// Login form validation using the shared validation utilities (Phase 5).
// Message preserved from the current LoginScreen.
import { isRequired } from "@shared/utils";
import type { LoginForm } from "../types/auth.types";

/** Returns an error message, or null when the form is valid. */
export function validateLoginForm(form: LoginForm): string | null {
  if (!isRequired(form.username) || !isRequired(form.password) || !isRequired(form.employeeId)) {
    return "Please enter username, password & Employee ID";
  }
  return null;
}
