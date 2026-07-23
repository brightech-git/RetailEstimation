// Phase 5 – Shared Hooks
// Tiny loading-flag helper for non-API async work (submit, print, etc.).
// `withLoading` wraps an async fn so loading is always reset, even on error.
import { useState, useCallback } from "react";

export function useLoading(initial = false) {
  const [loading, setLoading] = useState(initial);

  const start = useCallback(() => setLoading(true), []);
  const stop = useCallback(() => setLoading(false), []);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, start, stop, setLoading, withLoading };
}
