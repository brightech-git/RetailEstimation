import { useEffect, useState } from "react";
import { EmployeeService } from "../Service/EmployeeService";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Receipt label for an employee: "E5-NAME", or "E5" when the lookup fails
 * or finds nothing. Empty while there is no empId.
 *
 * @param {string} apiBaseUrl
 * @param {string|number} empId
 * @returns {string}
 */
const useEmployeeDisplay = (apiBaseUrl, empId) => {
  const [empDisplay, setEmpDisplay] = useState("");

  useEffect(() => {
    if (!empId || !apiBaseUrl) {
      setEmpDisplay("");
      return;
    }
    let cancelled = false;
    setEmpDisplay('');
    const idLabel = `E${String(empId).trim().replace(/^E/i, '')}`;
    const loadEmployee = async () => {
      const [storedId, storedName] = await Promise.all([
        AsyncStorage.getItem('EMPLOYEE_ID'), AsyncStorage.getItem('EMPLOYEE_NAME'),
      ]);
      const normalizeId = (id) => String(id ?? '').trim().replace(/^E/i, '').replace(/^0+(?=\d)/, '');
      if (storedName && normalizeId(storedId) === normalizeId(empId)) {
        return { empName: storedName };
      }
      return new EmployeeService(apiBaseUrl).getEmployeeById(empId);
    };
    loadEmployee()
      .then((found) => {
        if (cancelled) return;
        setEmpDisplay(found?.empName ? `${idLabel}-${String(found.empName).trim().toUpperCase()}` : idLabel);
      })
      .catch((err) => {
        console.log("[EmpDisplay] Error:", err.message);
        if (!cancelled) setEmpDisplay(idLabel);
      });
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, empId]);

  return empDisplay;
};

export default useEmployeeDisplay;
