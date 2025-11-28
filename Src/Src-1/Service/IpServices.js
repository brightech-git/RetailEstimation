// Src/Services/PrinterService.js
import axios from "axios";
import { useApiBaseUrl } from "../../Config/Config";

// React Hook for Printer APIs
export const usePrinterService = () => {
  const baseUrl = useApiBaseUrl();
  const API_URL = `${baseUrl}/printers`;

  // 1️⃣ Get Printer By ID
  const getPrinterById = async (id) => {
    const response = await axios.get(`${API_URL}/get`, { params: { id } });
    return response.data;
  };

  // 2️⃣ Get Printers By Employee ID
  const getPrintersByEmployee = async (empId) => {
    const response = await axios.get(`${API_URL}/by-emp`, {
      params: { empId },
    });

    console.log("📦 Printers for employee:", empId, response.data);

    return response.data;
  };

  // 3️⃣ Create Printer
  const createPrinter = async (printerData) => {
    const response = await axios.post(`${API_URL}/create`, printerData);
    return response.data;
  };

  // 4️⃣ Update Printer
  const updatePrinter = async (printerData) => {
    const response = await axios.put(`${API_URL}/update`, printerData);
    return response.data;
  };

  // 5️⃣ Delete Printer
  const deletePrinter = async (id) => {
    const response = await axios.delete(`${API_URL}/delete`, {
      params: { id },
    });
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