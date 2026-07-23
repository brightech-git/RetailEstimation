// Phase 1 – Foundation
// Simple centralized logger. One object, four methods. No transports, no
// remote logging. debug() is automatically silenced in production so release
// builds stay quiet; info/warn/error always print.
import { isProduction } from "../../app/config/environment";

type LogArgs = unknown[];

export const logger = {
  /** Dev-only diagnostics. Dropped entirely in production. */
  debug(message: string, ...args: LogArgs): void {
    if (isProduction) return;
    console.log(`[DEBUG] ${message}`, ...args);
  },
  info(message: string, ...args: LogArgs): void {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn(message: string, ...args: LogArgs): void {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error(message: string, ...args: LogArgs): void {
    console.error(`[ERROR] ${message}`, ...args);
  },
};

export type Logger = typeof logger;
