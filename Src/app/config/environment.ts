// Phase 1 – Foundation
// Active environment + the ONLY backend known before login: the auth server.
// The per-company API URL (returned by login) and the printer host stay
// DYNAMIC at runtime — they are never hardcoded here.
//
// Environment is chosen from React Native's __DEV__ flag, with an optional
// EXPO_PUBLIC_APP_ENV override for forcing production behavior in a dev build.

export type AppEnv = "development" | "production";

function resolveEnv(): AppEnv {
  const forced = (process.env.EXPO_PUBLIC_APP_ENV || "").toLowerCase();
  if (forced === "production") return "production";
  if (forced === "development") return "development";
  // eslint-disable-next-line no-undef
  return typeof __DEV__ !== "undefined" && __DEV__ ? "development" : "production";
}

export const ENV_NAME: AppEnv = resolveEnv();
export const isDevelopment = ENV_NAME === "development";
export const isProduction = ENV_NAME === "production";

interface EnvConfig {
  /** Auth server base URL. Login appends "/company/getByCredentials". */
  authBaseUrl: string;
  /** Default network timeout (ms) for API clients created in Phase 4. */
  apiTimeoutMs: number;
}

const CONFIG: Record<AppEnv, EnvConfig> = {
  development: {
    authBaseUrl:
      process.env.EXPO_PUBLIC_AUTH_BASE_URL || "https://app.bmgjewellers.com/api/v1",
    apiTimeoutMs: 15000,
  },
  production: {
    authBaseUrl:
      process.env.EXPO_PUBLIC_AUTH_BASE_URL || "https://app.bmgjewellers.com/api/v1",
    apiTimeoutMs: 10000,
  },
};

/** Active, immutable environment configuration for this build. */
export const ENV: EnvConfig = CONFIG[ENV_NAME];
