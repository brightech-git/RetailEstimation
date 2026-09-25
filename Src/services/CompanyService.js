import axios from "axios";

// Login + company-level lookups. These run before a cost centre is chosen,
// so they use plain axios (no costId/companyId interceptor) with a timeout.
// Full responses are returned so callers can check status and data.
const TIMEOUT = 10000;
const LOGIN_URL = "https://app.bmgjewellers.com/api/v1/company/getByCredentials";

export const CompanyService = {
  login: (username, password) =>
    axios.post(LOGIN_URL, { username, password }, { timeout: TIMEOUT }),

  // Cost centres ({COSTID, COSTNAME, COMPANYID}[]) for the company backend.
  getCostOptions: (baseUrl) =>
    axios.get(`${baseUrl}/costId`, { timeout: TIMEOUT }),

  // Company IDs ({company_id}[]) for multi-company logins.
  getCompanyIds: (baseUrl) =>
    axios.get(`${baseUrl}/company/companyIds`, { timeout: TIMEOUT }),
};

export default CompanyService;
