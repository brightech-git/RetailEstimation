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
    const list = await this.getEmployees(empId);
    const empIdNum = Number(empId);
    return list.find((e) => Number(e.empId) === empIdNum) || null;
  }
}
