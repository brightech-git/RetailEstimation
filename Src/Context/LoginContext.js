// LoginContext.js
// Public auth interface for the whole app (consumed by ~20 files). The network,
// storage, and companyUrl logic now lives in the auth module (Src/modules/auth)
// and the shared API layer — this context is a thin state holder that delegates
// to them. Its exported value shape is unchanged, so no consumer needs edits.
import React, { createContext, useState, useEffect } from "react";
import {
  login as authLogin,
  saveSession,
  loadSession,
  clearSession,
  getSelectedCostId,
  setSelectedCostId as persistSelectedCostId,
} from "@modules/auth";
import { api, ENDPOINTS, backendManager } from "@api";
import { logger } from "@core/logger";

export const LoginContext = createContext();

export const LoginProvider = ({ children, showToast }) => {
  // --- existing states ---
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyUrl, setCompanyUrl] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactNumber, setContactNumber] = useState("");
  const [stockUsername, setStockUsername] = useState("");
  const [stockPassword, setStockPassword] = useState("");

  // --- cost ID feature ---
  const [costOptions, setCostOptions] = useState([]);
  const [selectedCostId, setSelectedCostId] = useState("");
  const [costLoading, setCostLoading] = useState(false);

  // --- login: delegates the network call to authService (api + auth backend),
  //     which also registers the per-company backend URL. Cost ID is NOT sent. ---
  const login = async (username, password) => {
    try {
      setLoading(true);
      const data = await authLogin({ username, password });

      if (data) {
        logger.debug("Login successful", data?.COMPANYNAME);

        setUsername(data.USERNAME || "");
        setUserId(data.USERID || null);
        setCompanyName(data.COMPANYNAME || "");
        setCompanyId(data.COMPANYID || null);
        setCompanyLogo(data.LOGO || null);
        setCompanyUrl(data.BASEURL || null);
        setCompanyLogoUrl(data.LOGOBASEURL || null);
        setCompanyData(data);
        setContactNumber(data.CONTACTNUMBER || "");
        setStockUsername(data.STOCKUSERNAME || "");
        setStockPassword(data.STOCKPASSWORD || "");

        // Persist COMPANY_DATA (same key) and re-register the backend URL.
        await saveSession(data);

        showToast?.(`Welcome, ${data.COMPANYNAME || username}!`, "success", 3000);
        return true;
      } else {
        showToast?.("Invalid credentials", "error", 3000);
        return false;
      }
    } catch (error) {
      logger.error("Login error", error?.message);
      showToast?.("Login failed. Please try again.", "error", 3000);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- fetch cost ID options for the logged-in company via the shared API
  //     layer (company backend resolved from backendManager / companyUrl). ---
  const fetchCostOptions = async (baseUrlOverride) => {
    if (baseUrlOverride) backendManager.setCompanyUrl(baseUrlOverride);

    const baseUrl = backendManager.getCompanyUrl() || companyUrl;
    if (!baseUrl) {
      logger.warn("fetchCostOptions: no company base URL available yet");
      showToast?.("Please login again to load cost options", "error", 3000);
      return false;
    }

    try {
      setCostLoading(true);
      const response = await api.get(ENDPOINTS.COST.LIST);

      if (Array.isArray(response.data)) {
        setCostOptions(response.data);
        logger.debug(`Cost options loaded: ${response.data.length} record(s)`);
        return true;
      } else {
        logger.warn("Cost centre response was not an array", response.data);
        showToast?.("Failed to load cost options", "error", 3000);
        return false;
      }
    } catch (error) {
      logger.error("Fetch cost options error", error?.message);
      showToast?.("Could not fetch cost options", "error", 3000);
      return false;
    } finally {
      setCostLoading(false);
    }
  };

  // --- update selected cost ID and persist it (same SELECTED_COST_ID key) ---
  const updateSelectedCostId = async (costId) => {
    setSelectedCostId(costId);
    // Resolve the string company code (e.g. "SFL") from costOptions
    const companyCode = costOptions?.find((o) => o.COSTID === costId)?.COMPANYID || "";
    await persistSelectedCostId(costId, companyCode);
  };

  // --- logout: clear session (COMPANY_DATA + SELECTED_COST_ID + backend URL) ---
  const logout = async () => {
    try {
      await clearSession();

      setUsername("");
      setUserId(null);
      setCompanyName("");
      setCompanyId(null);
      setCompanyLogo(null);
      setCompanyUrl(null);
      setCompanyData(null);
      setCompanyLogoUrl(null);
      setContactNumber("");
      setStockUsername("");
      setStockPassword("");

      setCostOptions([]);
      setSelectedCostId("");
      setCostLoading(false);

      showToast?.("Logged out successfully", "info", 2000);
    } catch (error) {
      logger.error("Logout error", error?.message);
      showToast?.("Logout error", "error", 3000);
    }
  };

  // --- restore persisted session + selected cost ID on app start ---
  const loadStoredData = async () => {
    try {
      const data = await loadSession();
      if (data) {
        setUsername(data.USERNAME || "");
        setUserId(data.USERID || null);
        setCompanyName(data.COMPANYNAME || "");
        setCompanyId(data.COMPANYID || null);
        setCompanyLogo(data.LOGO || null);
        setCompanyUrl(data.BASEURL || null);
        setCompanyData(data);
        setCompanyLogoUrl(data.LOGOBASEURL || null);
        setContactNumber(data.CONTACTNUMBER || "");
        setStockUsername(data.STOCKUSERNAME || "");
        setStockPassword(data.STOCKPASSWORD || "");
        logger.debug("Restored company data", data?.COMPANYNAME);
      }

      const storedCostId = await getSelectedCostId();
      if (storedCostId) {
        setSelectedCostId(storedCostId);
        logger.debug("Restored selected cost ID", storedCostId);
      }
    } catch (err) {
      logger.error("Error loading stored data", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        // existing
        username,
        setUsername,
        userId,
        setUserId,
        companyName,
        setCompanyName,
        companyLogo,
        setCompanyLogo,
        companyUrl,
        setCompanyUrl,
        companyLogoUrl,
        setCompanyLogoUrl,
        companyId,
        setCompanyId,
        companyData,
        setCompanyData,
        loading,
        login,
        logout,
        contactNumber,
        setContactNumber,
        stockUsername,
        setStockUsername,
        stockPassword,
        setStockPassword,

        // cost ID related
        costOptions,
        selectedCostId,
        setSelectedCostId: updateSelectedCostId,
        costLoading,
        fetchCostOptions,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
