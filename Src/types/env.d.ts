// Phase 1 – Foundation
// Ambient types for the optional public env vars read in app/config/environment.ts.
// Expo inlines any EXPO_PUBLIC_-prefixed variable at build time.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** 'development' | 'production' — optional override of the auto-detected env. */
      EXPO_PUBLIC_APP_ENV?: string;
      /** Optional override for the auth server base URL. */
      EXPO_PUBLIC_AUTH_BASE_URL?: string;
    }
  }
}

export {};
