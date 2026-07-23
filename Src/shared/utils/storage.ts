// Phase 5 – Shared Utilities
// Thin AsyncStorage wrapper. Handles JSON automatically and never throws
// (errors are logged and swallowed so callers stay simple). No business logic.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@core/logger";

export const storage = {
  /** Read a value. Objects are JSON-parsed; plain strings return as-is. */
  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T; // stored as a plain string (e.g. "BH")
      }
    } catch (e) {
      logger.error("storage.get failed", key, e);
      return null;
    }
  },

  /** Write a value. Strings are stored as-is; everything else is JSON-stringified. */
  async set(key: string, value: unknown): Promise<void> {
    try {
      const raw = typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, raw);
    } catch (e) {
      logger.error("storage.set failed", key, e);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      logger.error("storage.remove failed", key, e);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      logger.error("storage.clear failed", e);
    }
  },
};
