// Phase 5 – Shared Hooks
// Returns a debounced copy of a value that only updates after `delay` ms of
// no changes. Useful for search inputs and scan de-duplication.
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
