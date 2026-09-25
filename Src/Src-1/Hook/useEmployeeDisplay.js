import { useEffect, useState } from "react";
import { EmployeeService } from "../Service/EmployeeService";

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
    new EmployeeService(apiBaseUrl)
      .getEmployeeById(empId)
      .then((found) => {
        if (cancelled) return;
        setEmpDisplay(found ? `E${found.empId}-${found.empName}` : `E${empId}`);
      })
      .catch((err) => {
        console.log("[EmpDisplay] Error:", err.message);
        if (!cancelled) setEmpDisplay(`E${empId}`);
      });
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, empId]);

  return empDisplay;
};

export default useEmployeeDisplay;
