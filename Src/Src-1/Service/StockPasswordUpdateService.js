// Service/StockPasswordUpdateService.js
// Migrated to the shared API layer. The stock-password update targets the AUTH
// backend (same host used for login), so the request is flagged { auth: true }.
// No hardcoded URL, no fetch, no console. Payload (stockPassword + id as query
// params), method (PUT), and response handling are preserved.
import { api, ENDPOINTS } from "@api";
import { logger } from "@core/logger";

export const updateCompanyStockPassword = async ({ stockPassword, id }) => {
  try {
    const response = await api.put(ENDPOINTS.AUTH.UPDATE_COMPANY, null, {
      auth: true,
      params: { stockPassword, id },
    });
    return response.data;
  } catch (error) {
    logger.error("Update Company Stock Password Error:", error);
    throw error;
  }
};
