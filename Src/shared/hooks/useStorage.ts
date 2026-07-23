// Phase 5 – Shared Hooks
// Syncs a single AsyncStorage key with React state via the storage util.
// Loads once on mount; `setValue` persists. No business logic.
import { useState, useEffect, useCallback } from "react";
import { storage } from "@shared/utils";

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValueState] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await storage.get<T>(key);
      if (active && stored !== null && stored !== undefined) setValueState(stored);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [key]);

  const setValue = useCallback(
    async (next: T) => {
      setValueState(next);
      await storage.set(key, next);
    },
    [key]
  );

  const remove = useCallback(async () => {
    setValueState(initialValue);
    await storage.remove(key);
  }, [key, initialValue]);

  return { value, setValue, remove, loading };
}
