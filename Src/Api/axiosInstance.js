import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In-memory cache
let _costId = null;
let _companyId = null;
let _isMultiCompany = false;

// Load saved values on app start
export const initCostCache = async () => {
  try {
    const [[, costId], [, companyId]] = await AsyncStorage.multiGet([
      "SELECTED_COST_ID",
      "SELECTED_COMPANY_ID",
    ]);

    _costId = costId || null;
    _companyId = companyId || null;

    // Multi-company selection means a selected company ID exists
    // without a selected cost centre.
    _isMultiCompany = !_costId && !!_companyId;

    console.log("📦 Cache initialized:", {
      costId: _costId,
      companyId: _companyId,
      isMultiCompany: _isMultiCompany,
    });
  } catch (e) {
    console.warn("initCostCache: failed to read cost/company ID", e);
  }
};

export const setCostCache = (costId, companyId) => {
  _costId = costId || null;
  _companyId = companyId || null;

  _isMultiCompany = !_costId && !!_companyId;

  console.log("🔄 Cache updated:", {
    costId: _costId,
    companyId: _companyId,
    isMultiCompany: _isMultiCompany,
  });
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

    if (!skip) {
      if (_isMultiCompany) {
        // -----------------------------------------
        // COMPANYID = 15 flow
        // User selected DJG / DEM / DBJ etc.
        // -----------------------------------------

        if (_companyId) {
          config.params = {
            ...config.params,
            compId: _companyId,
          };

          console.log("🏷️ Multi-company header: compId=", _companyId);
        }
      } else {
        // -----------------------------------------
        // Normal company flow
        // Cost Centre + Company ID
        // -----------------------------------------

        if (_costId) {
          config.params = {
            ...config.params,
            costId: _costId,
          };
        }

        if (_companyId) {
          config.params = {
            ...config.params,
            companyId: _companyId,
          };
        }
      }
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
