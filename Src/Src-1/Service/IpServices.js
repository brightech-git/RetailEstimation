import { useApiBaseUrl } from "../../Config/Config";
import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export const usePrinterService = () => {
  const baseUrl = useApiBaseUrl();
  const api = createApiInstance(baseUrl);

  const getPrinterById = async (id) => {
    const response = await api.get(ENDPOINTS.PRINTER_GET, { params: { id } });
    return response.data;
  };

  const getPrintersByEmployee = async (empId) => {
    const response = await api.get(ENDPOINTS.PRINTER_BY_EMP, { params: { empId } });
    // console.log("📦 Printers for employee:", empId, response.data);
    return response.data;
  };

  const createPrinter = async (printerData) => {
    const response = await api.post(ENDPOINTS.PRINTER_CREATE, printerData);
    return response.data;
  };

  const updatePrinter = async (printerData) => {
    const response = await api.put(ENDPOINTS.PRINTER_UPDATE, printerData);
    return response.data;
  };

  const deletePrinter = async (id) => {
    const response = await api.delete(ENDPOINTS.PRINTER_DELETE, { params: { id } });
    return response.data;
  };

  return { getPrinterById, getPrintersByEmployee, createPrinter, updatePrinter, deletePrinter };
};
