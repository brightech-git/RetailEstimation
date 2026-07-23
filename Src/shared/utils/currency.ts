// Phase 5 – Shared Utilities
// Number/currency formatting. Mirrors the patterns already used across the app
// (toFixed with 0/2/3 decimals, ₹ + en-IN grouping). Pure functions, no state.

/** Coerce to a finite number, or 0 if invalid. */
function safe(value: number | string | null | undefined): number {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return n == null || Number.isNaN(n) ? 0 : n;
}

/** Fixed-decimal string, e.g. formatAmount(12.5) -> "12.50". */
export function formatAmount(value: number | string | null | undefined, decimals = 2): string {
  return safe(value).toFixed(decimals);
}

/** Indian rupee with grouping, e.g. formatCurrency(120000) -> "₹1,20,000.00". */
export function formatCurrency(
  value: number | string | null | undefined,
  decimals = 2
): string {
  return `₹${safe(value).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Weight in grams — 3 decimals by convention. */
export function formatWeight(value: number | string | null | undefined, decimals = 3): string {
  return formatAmount(value, decimals);
}

/** Percentage string, e.g. formatPercentage(12.5) -> "12.50%". */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals = 2
): string {
  return `${formatAmount(value, decimals)}%`;
}
