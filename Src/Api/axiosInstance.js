import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In-memory cache — updated on app start and whenever cost centre changes
let _costId = null;
let _companyId = null;

// Call this once on app start and after every cost centre selection
export const initCostCache = async () => {
  try {
    const [[, costId], [, companyId]] = await AsyncStorage.multiGet([
      "SELECTED_COST_ID",
      "SELECTED_COMPANY_ID",
    ]);
    _costId = costId || null;
    _companyId = companyId || null;
  } catch (e) {
    console.warn("initCostCache: failed to read cost/company ID", e);
  }
};

export const setCostCache = (costId, companyId) => {
  _costId = costId || null;
  _companyId = companyId || null;
};

// Endpoints that should NEVER receive costId / companyId
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

const createApiInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const skip = SKIP_COST_ID.some((path) => config.url?.includes(path));
    if (!skip) {
      if (_costId) config.params = { ...config.params, costId: _costId };
      if (_companyId) config.params = { ...config.params, companyId: _companyId };
    }
    return config;
  });

  return instance;
};

export default createApiInstance;
