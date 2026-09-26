import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In-memory cache
let _costId = null;
let _companyId = null;

// Load saved values on app start
export const initCostCache = async () => {
  try {
    const [[, costId], [, companyId]] = await AsyncStorage.multiGet([
      "SELECTED_COST_ID",
      "SELECTED_COMPANY_ID",
    ]);

    _costId = costId || null;
    _companyId = companyId || null;

    console.log("📦 Cache initialized:", { costId: _costId, companyId: _companyId });
  } catch (e) {
    console.warn("initCostCache: failed to read cost/company ID", e);
  }
};

export const setCostCache = (costId, companyId) => {
  _costId = costId || null;
  _companyId = companyId || null;

  console.log("🔄 Cache updated:", { costId: _costId, companyId: _companyId });
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
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use((config) => {
    const skip = SKIP_COST_ID.some((path) => config.url?.includes(path));

    if (!skip && _companyId) {
      config.params = {
        ...config.params,
        costId: _costId ?? "",
        companyId: _companyId,
      };
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📡 API REQUEST");
    console.log("➡️ Method:", config.method?.toUpperCase());
    console.log("➡️ URL:", `${config.baseURL || ""}${config.url}`);
    console.log("➡️ Params:", config.params);
    console.log("➡️ Headers:", config.headers);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return config;
  });

  return instance;
};

export default createApiInstance;
