// Phase 5 – Shared Utilities
// Small, pure validators for the checks the app already performs
// (required fields, numeric inputs, phone, password length, printer IP).

export const isRequired = (value: unknown): boolean =>
  value !== null && value !== undefined && String(value).trim().length > 0;

export const isNumber = (value: unknown): boolean =>
  value !== "" && value !== null && value !== undefined && !Number.isNaN(Number(value));

export const isPositiveNumber = (value: unknown): boolean =>
  isNumber(value) && Number(value) > 0;

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/** Accepts 7–15 digits, ignoring spaces/dashes. */
export const isPhone = (value: string): boolean =>
  /^\d{7,15}$/.test(value.replace(/\D/g, ""));

export const isValidPassword = (value: string, minLength = 4): boolean =>
  value.trim().length >= minLength;

/** IPv4 dotted-quad (matches the printer IP pattern used in AddPrinter). */
export const isIpAddress = (value: string): boolean =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(value.trim());
