// Phase 5 – Shared Utilities
// Date helpers. Matches existing usage: API dates as yyyy-mm-dd
// (toISOString().split("T")[0]) and display dates as dd-mm-yyyy.

/** yyyy-mm-dd for API params (e.g. billDate). Defaults to today. */
export function toApiDate(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/** dd-mm-yyyy for display. Returns the original string if unparseable. */
export function formatDate(input: Date | string | null | undefined): string {
  if (input == null) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return typeof input === "string" ? input : "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

/** True if the value parses to a real date. */
export function isValidDate(input: Date | string): boolean {
  const d = typeof input === "string" ? new Date(input) : input;
  return !Number.isNaN(d.getTime());
}
