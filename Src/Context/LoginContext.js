// LoginContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { initCostCache, setCostCache } from "../Api/axiosInstance";

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

  // --- new states for cost ID feature ---
  const [costOptions, setCostOptions] = useState([]);      // list of {COSTID, COSTNAME, COMPANYID}
  const [selectedCostId, setSelectedCostId] = useState(""); // currently selected COSTID (e.g., "FH")
  const [selectedCompanyId, setSelectedCompanyId] = useState(""); // COMPANYID from selected cost centre
  const [hasCostCentres, setHasCostCentres] = useState(null); // null=unknown, true/false after fetch
  const [costLoading, setCostLoading] = useState(false);   // loading indicator for fetching options

  // --- login function (unchanged, cost ID is NOT sent here) ---
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://app.bmgjewellers.com/api/v1/company/getByCredentials",
        { username, password },
        { timeout: 10000 },
      );

      if (response.status === 200 && response.data) {
        const data = response.data;
        console.log("🔐 Login successful:", data);

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

        await AsyncStorage.setItem("COMPANY_DATA", JSON.stringify(data));
        if (data.USERID) {
          await AsyncStorage.setItem("EMPLOYEE_ID", String(data.USERID));
        }

        console.log("✅ Login stored:", data);

        showToast?.(
          `Welcome, ${data.COMPANYNAME || username}!`,
          "success",
          3000,
        );
        return true;
      } else {
        showToast?.("Invalid credentials", "error", 3000);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast?.("Login failed. Please try again.", "error", 3000);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- fetch cost ID options for the logged-in company ---
  // Uses the company's own base URL (returned by login) so each
  // customer's app instance talks to their own backend.
  const fetchCostOptions = async (baseUrlOverride) => {
    const baseUrl = baseUrlOverride || companyUrl;

    if (!baseUrl) {
      console.warn("fetchCostOptions: no company base URL available yet");
      showToast?.("Please login again to load cost options", "error", 3000);
      return false;
    }

    const url = `${baseUrl}/costId`;

    try {
      setCostLoading(true);
      console.log("📡 [GET] Cost centre request:", url);

      const response = await axios.get(url, { timeout: 10000 });

      console.log("✅ Cost centre response status:", response.status);
      console.log("📦 Cost centre response data:", response.data);

      if (response.status === 200 && Array.isArray(response.data)) {
        // Detect if cost centres are actually configured (COSTID non-empty)
        const validOptions = response.data.filter((o) => o.COSTID?.trim());
        const companyIdFromCost = response.data[0]?.COMPANYID || "";

        // Always store the COMPANYID from the cost response (e.g. "RTM", "SFH")
        if (companyIdFromCost) {
          setSelectedCompanyId(companyIdFromCost);
          await AsyncStorage.setItem("SELECTED_COMPANY_ID", companyIdFromCost);
          setCostCache("", companyIdFromCost);
          console.log("📦 Company ID from cost options:", companyIdFromCost);
        }

        if (validOptions.length === 0) {
          setHasCostCentres(false);
          await AsyncStorage.setItem("HAS_COST_CENTRES", "false");
          setCostOptions([]);
          console.log("📦 No cost centres configured, skipping selection");
        } else {
          setHasCostCentres(true);
          await AsyncStorage.setItem("HAS_COST_CENTRES", "true");
          setCostOptions(validOptions);
          console.log(`📦 Cost options loaded: ${validOptions.length} record(s)`);
        }
        return true;
      } else {
        console.warn(
          "⚠️ Cost centre response was not a 200 + array:",
          response.status,
          response.data
        );
        showToast?.("Failed to load cost options", "error", 3000);
        return false;
      }
    } catch (error) {
      console.error("❌ Fetch cost options error:", {
        url,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      showToast?.("Could not fetch cost options", "error", 3000);
      return false;
    } finally {
      setCostLoading(false);
    }
  };

  // --- update selected cost ID + company ID and persist both ---
  const updateSelectedCostId = async (costId) => {
    setSelectedCostId(costId);
    if (costId) {
      await AsyncStorage.setItem("SELECTED_COST_ID", costId);
      const match = costOptions.find((o) => o.COSTID === costId);
      if (match?.COMPANYID) {
        await AsyncStorage.setItem("SELECTED_COMPANY_ID", match.COMPANYID);
        setSelectedCompanyId(match.COMPANYID);
        setCostCache(costId, match.COMPANYID);
      } else {
        setSelectedCompanyId("");
        setCostCache(costId, null);
      }
    } else {
      await AsyncStorage.removeItem("SELECTED_COST_ID");
      await AsyncStorage.removeItem("SELECTED_COMPANY_ID");
      setCostCache(null, null);
    }
  };

  // --- logout: clear everything including cost data ---
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("COMPANY_DATA");
      await AsyncStorage.removeItem("SELECTED_COST_ID");
      await AsyncStorage.removeItem("SELECTED_COMPANY_ID");
      await AsyncStorage.removeItem("HAS_COST_CENTRES");
      await AsyncStorage.removeItem("EMPLOYEE_ID");

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

      // clear cost-related states
      setCostOptions([]);
      setSelectedCostId("");
      setSelectedCompanyId("");
      setHasCostCentres(null);
      setCostLoading(false);

      showToast?.("Logged out successfully", "info", 2000);
    } catch (error) {
      console.error("Logout error:", error);
      showToast?.("Logout error", "error", 3000);
    }
  };

  // --- load stored company data (existing) and stored selected cost ID (new) ---
  const loadStoredData = async () => {
    try {
      // Load company data
      const stored = await AsyncStorage.getItem("COMPANY_DATA");
      if (stored) {
        const data = JSON.parse(stored);
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
        if (data.USERID) {
          await AsyncStorage.setItem("EMPLOYEE_ID", String(data.USERID));
        }
        console.log("📦 Restored company data:", data);
      }

      const storedCostId = await AsyncStorage.getItem("SELECTED_COST_ID");
      const storedCompanyId = await AsyncStorage.getItem("SELECTED_COMPANY_ID");
      const storedHasCostCentres = await AsyncStorage.getItem("HAS_COST_CENTRES");
      if (storedCostId) {
        setSelectedCostId(storedCostId);
        console.log("📦 Restored selected cost ID:", storedCostId);
      }
      if (storedCompanyId) {
        setSelectedCompanyId(storedCompanyId);
        console.log("📦 Restored selected company ID:", storedCompanyId);
      }
      if (storedHasCostCentres !== null) {
        setHasCostCentres(storedHasCostCentres === "true");
      }
      // Warm up the sync cache so interceptor works immediately
      await initCostCache();

      // Optionally fetch fresh cost options after restoring (if needed)
      // Uncomment the next line if you want to always fetch on app start
      // await fetchCostOptions();
    } catch (err) {
      console.error("Error loading stored data:", err);
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

        // new cost ID related
        costOptions,
        selectedCostId,
        selectedCompanyId,
        hasCostCentres,        // null=unknown, true=show picker, false=skip picker
        setSelectedCostId: updateSelectedCostId,
        costLoading,
        fetchCostOptions,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};