import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class EmployeeService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  /**
   * Employees matching a search (empty search → all employees).
   * @param {string} [search]
   * @returns {Promise<{empId, empName}[]>}
   */
  async getEmployees(search = "") {
    const response = await this.api.get(ENDPOINTS.EMPLOYEES(search));
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * One employee by id, or null when not found.
   * @param {string|number} empId
   */
  async getEmployeeById(empId) {
    const normalizeId = (id) => String(id ?? '').trim().replace(/^E/i, '').replace(/^0+(?=\d)/, '').toUpperCase();
    const findEmployee = (list) => {
      const found = list.find((e) => normalizeId(e.empId ?? e.empid ?? e.EMPID ?? e.emp_id) === normalizeId(empId));
      return found ? {
        ...found,
        empId: found.empId ?? found.empid ?? found.EMPID ?? found.emp_id,
        empName: found.empName ?? found.empname ?? found.EMPNAME ?? found.emp_name ?? '',
      } : null;
    };
    const found = findEmployee(await this.getEmployees(empId));
    // Some employee searches match names only, so an ID search returns no rows.
    return found?.empName ? found : findEmployee(await this.getEmployees());
  }
}
