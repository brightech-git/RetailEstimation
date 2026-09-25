import { useCallback, useState } from "react";
import { EmployeeService } from "../Service/EmployeeService";

/**
 * Full employee list, loaded on demand (e.g. when a picker opens).
 *
 * @param {string} apiBaseUrl
 * @returns {{ employees: object[], loading: boolean, loadEmployees: () => Promise<void> }}
 */
const useEmployeeList = (apiBaseUrl) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      setEmployees(await new EmployeeService(apiBaseUrl).getEmployees(""));
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  return { employees, loading, loadEmployees };
};

export default useEmployeeList;
