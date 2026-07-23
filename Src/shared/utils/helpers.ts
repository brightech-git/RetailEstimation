// Phase 5 – Shared Utilities
// Small general-purpose helpers for patterns repeated across the app.

/** True for null/undefined, empty string, empty array, or empty object. */
export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
};

/** Safe numeric parse with a fallback (replaces scattered parseFloat/Number). */
export const toNumber = (value: unknown, fallback = 0): number => {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isNaN(n) ? fallback : n;
};

/** De-duplicate an array (replaces Array.from(new Set(...))). */
export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

/** Constrain a number to a range. */
export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);

/** Await a number of milliseconds. */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
