import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Endpoints that should NEVER receive costId / companyId from interceptor
// (either they don't need it, or they handle their own uppercase COSTID param)
const SKIP_COST_ID = [
  "/ipaddress",
  "/todayrate",
  "/list",
  "/printers/get",
  "/printers/by-emp",
  "/printers/create",
  "/printers/update",
  "/printers/delete",
];

/**
 * Creates an axios instance scoped to the given baseURL.
 * A request interceptor automatically appends costId and companyId
 * as query params on every request — only if they exist in AsyncStorage
 * and the endpoint is not in the SKIP_COST_ID list.
 */
const createApiInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use(async (config) => {
    const skip = SKIP_COST_ID.some((path) => config.url?.includes(path));
    if (!skip) {
      try {
        const [costId, companyId] = await AsyncStorage.multiGet([
          "SELECTED_COST_ID",
          "SELECTED_COMPANY_ID",
        ]);
        if (costId[1]) config.params = { ...config.params, costId: costId[1] };
        if (companyId[1]) config.params = { ...config.params, companyId: companyId[1] };
      } catch (e) {
        console.warn("axiosInstance: failed to read cost/company ID", e);
      }
    }
    return config;
  });

  return instance;
};

export default createApiInstance;
