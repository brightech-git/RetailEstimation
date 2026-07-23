// IpServices.js
// The single printer-CRUD implementation for the app (the duplicate
// createPrinterService in EstimationPrinterService has been removed).
// Uses the shared API layer (api + ENDPOINTS.PRINTER) + logger. Same method
// names, params, payloads and responses as before.
import { api, ENDPOINTS } from "@api";
import { logger } from "@core/logger";

export const usePrinterService = () => {
  const getPrinterById = async (id) => {
    const response = await api.get(ENDPOINTS.PRINTER.GET, { params: { id } });
    return response.data;
  };

  const getPrintersByEmployee = async (empId) => {
    const response = await api.get(ENDPOINTS.PRINTER.BY_EMP, { params: { empId } });
    logger.debug("Printers for employee:", empId, response.data);
    return response.data;
  };

  const createPrinter = async (printerData) => {
    const response = await api.post(ENDPOINTS.PRINTER.CREATE, printerData);
    return response.data;
  };

  const updatePrinter = async (printerData) => {
    const response = await api.put(ENDPOINTS.PRINTER.UPDATE, printerData);
    return response.data;
  };

  const deletePrinter = async (id) => {
    const response = await api.delete(ENDPOINTS.PRINTER.DELETE, { params: { id } });
    return response.data;
  };

  return {
    getPrinterById,
    getPrintersByEmployee,
    createPrinter,
    updatePrinter,
    deletePrinter,
  };
};
