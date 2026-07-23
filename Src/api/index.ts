// Phase 3 – API Foundation
// Public entry for the API layer. Usage:
//   import { api, ENDPOINTS, backendManager } from "@api";
export { api } from "./axios";
export type { ApiError } from "./axios";
export { backendManager } from "./backendManager";
export type { BackendManager } from "./backendManager";
export { ENDPOINTS } from "./endpoints";
export type { Endpoints } from "./endpoints";
