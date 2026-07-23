// Phase 1 – Foundation
// App-level metadata. Contains NO backend URLs (auth lives in environment.ts;
// the per-company and printer backends are resolved dynamically at runtime).
import { ENV, ENV_NAME } from "./environment";

export const APP_CONFIG = {
  appName: "RetailEstimation",
  version: "1.0.0", // keep in sync with app.json + package.json
  environment: ENV_NAME,
  defaultTimeoutMs: ENV.apiTimeoutMs,
  /** Prefix for AsyncStorage keys, to avoid collisions across features. */
  storageNamespace: "@retailestimation",
} as const;

export type AppConfig = typeof APP_CONFIG;
