// Phase 6 – Auth Module
// Types for the authentication flow. CompanyData mirrors the fields the login
// response already provides (as used by LoginContext today).

export interface LoginCredentials {
  username: string;
  password: string;
}

/** The login form also collects an Employee ID (stored locally, not sent). */
export interface LoginForm extends LoginCredentials {
  employeeId: string;
}

/** Shape of the login response / persisted company session. */
export interface CompanyData {
  USERNAME?: string;
  USERID?: string | number | null;
  COMPANYNAME?: string;
  COMPANYID?: string | number | null;
  LOGO?: string | null;
  BASEURL?: string | null;
  LOGOBASEURL?: string | null;
  CONTACTNUMBER?: string;
  STOCKUSERNAME?: string;
  STOCKPASSWORD?: string;
  // Backend returns additional fields; keep them without losing type-safety.
  [key: string]: unknown;
}
