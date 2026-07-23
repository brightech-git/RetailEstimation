import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class EstimationService {
  constructor(apiBaseUrl) {
    this.api = axios.create({
      baseURL: apiBaseUrl,
    });
  }

  // Centralized costId accessor - single source of truth for the
  // logged-in user's selected cost centre (set by LoginContext).
  async getCostId() {
    try {
      return (await AsyncStorage.getItem("SELECTED_COST_ID")) || "";
    } catch (e) {
      console.warn("Failed to read SELECTED_COST_ID:", e);
      return "";
    }
  }

  // Data fetching methods
  async fetchItemList() {
    const response = await this.api.get("/list");
    const data = response.data;
    const uniqueItemIds = Array.from(new Set(data.map((item) => item.ITEMID)));
    return uniqueItemIds;
  }

  // NOTE: COSTID is a required query param on the backend for both
  // /estimationTotal and /tag-details, so the key itself must always be
  // sent (Spring 400s if it's missing entirely). When the logged-in
  // company has no cost centre selected, we send COSTID="" - the
  // backend's estimationTotal already handles that by resolving the
  // COSTID itself from ITEMID+TAGNO, so this degrades gracefully.
  async fetchEstimationData(ITEMID, TAGNO) {
    const costId = await this.getCostId();
    const response = await this.api.get("/estimationTotal", {
      params: { ITEMID, TAGNO, COSTID: costId || "" },
    });
    return response.data;
  }

  async checkTagExists(ITEMID, TAGNO) {
    try {
      const costId = await this.getCostId();
      const response = await this.api.get(`/tag-details`, {
        params: { ITEMID, TAGNO, COSTID: costId || "" },
      });
      return response.data;
    } catch (error) {
      // Without a real cost centre this lookup can fail server-side
      // (404/500) rather than returning "not issued" - either way, treat
      // it as "couldn't verify, let the user continue" instead of
      // blocking the whole screen.
      console.warn("checkTagExists failed, continuing without it:", error);
      return null;
    }
  }

  async getTransactionNumber() {
    const response = await this.api.get("/tranno");
    return response.data;
  }

  async getEstimationBatchNo(costId, companyId) {
    const today = new Date().toISOString().split("T")[0];
    const response = await this.api.get("/estbatchno", {
      params: {
        costId: costId || "BP",
        billDate: today,
        companyId: companyId || "BMG",
        isEstimate: true,
      },
      timeout: 15000,
    });
    return response.data;
  }

  async getStoneInputs(itemId, tagNo, costId) {
    try {
      const resolvedCostId = costId || (await this.getCostId());
      const response = await this.api.get("/stnInputs", {
        params: { itemid: itemId, tagno: tagNo, costId: resolvedCostId || undefined },
      });
      return response.data || [];
    } catch (err) {
      console.warn(`Failed to fetch stone inputs`, err);
      return [];
    }
  }

  async getStoneCategoryCode(itemId, stnItemId, costId) {
    try {
      const resolvedCostId = costId || (await this.getCostId());
      const response = await this.api.get("/stone-catcode", {
        params: { itemId, stnItemId, costId: resolvedCostId || undefined },
      });
      return response.data?.stoneCatCode || "";
    } catch (err) {
      console.warn(`Failed to fetch catCode`, err);
      return "";
    }
  }

  async getTagDetails(tagNo, costId) {
    try {
      const resolvedCostId = costId || (await this.getCostId());
      const response = await this.api.get(`/tagDetails/${tagNo}`, {
        params: { costId: resolvedCostId || undefined },
      });
      return response.data || {};
    } catch (err) {
      console.warn(`Failed to fetch tag details`, err);
      return {};
    }
  }

  async getTransactionDate(ITEMID, TAGNO) {
    try {
      const response = await this.api.get("/trandate", {
        params: { ITEMID, TAGNO },
      });
      return response.data?.trandate;
    } catch (err) {
      console.warn(`Failed to fetch trandate`, err);
      return null;
    }
  }

  async generateEstissStoneSno(costId, companyId) {
    try {
      const response = await this.api.get("/generate-estissstone-sno", {
        params: { costId, companyId },
      });
      return response.data || "";
    } catch (err) {
      console.warn(`Failed to generate SNO`, err);
      return "";
    }
  }

  async generateEstTaxTranSno(costId, companyId) {
    try {
      const response = await this.api.get("/generate-esttaxtran-sno", {
        params: { costId, companyId },
      });
      return String(response.data || "");
    } catch (err) {
      console.warn(`Failed to generate ESTTAXTRAN SNO:`, err);
      return "";
    }
  }

  async getTaxDetails(itemId) {
    try {
      const response = await this.api.get(`/getEstTaxTranDetails/${itemId}`);
      return response?.data?.[0] || {};
    } catch (err) {
      console.warn(`Failed to fetch tax details for ITEMID=${itemId}`, err);
      return {};
    }
  }

  // Data submission methods
  async submitEstimationData(data) {
    const response = await this.api.post("/estissue", data);
    console.log("Save response:", response.data);
    return response.data;
  }

  async submitStoneData(data) {
    const response = await this.api.post("/eststnissue", data, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data;
  }

  async submitTaxData(data) {
    const response = await this.api.post("/estTaxTran", data);
    return response.data;
  }

  async updateTransactionNumber() {
    const response = await this.api.post("/updateTranno");
    return response.data;
  }

  async getIPAddress() {
    const response = await this.api.get("/ipaddress");
    return response.data?.ip || response.data || "";
  }

  async getEstimationDetails(tranno, costId) {
    const resolvedCostId = costId || (await this.getCostId());
    const response = await this.api.get(`/details/${tranno}`, {
      params: { costId: resolvedCostId || undefined },
    });
    return response.data?.[0] || {};
  }

  async getTodayRates() {
    const response = await this.api.get("/todayrate");
    return response.data;
  }

  async submitPrintData(data) {
    const response = await this.api.post("/estprint", data);
    return response.data;
  }
}

// Utility functions
export const formatDateToSqlDateTime = (dateInput) => {
  const dt = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(dt)) return null;
  return dt.toISOString().replace("T", " ").split(".")[0];
};

export const formatDateToMidnightSql = (dateInput = new Date()) => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00`;
};

export const parseValue = (value) => {
  if (!value || value === "null" || value === "undefined") return 0;
  const stringValue = String(value).replace(/"/g, "").trim();
  const parsed = parseFloat(stringValue);
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateGrossAmount = (row) => {
  const grossFromApi = parseValue(row.GrossAmount);
  if (grossFromApi > 0) {
    return grossFromApi;
  }
  const netWt = parseValue(row.NETWT);
  const wastage = parseValue(row.Wastage);
  const rate = parseValue(row.Rate);
  const mc = parseValue(row.MC);
  const stoneAmt = parseValue(row.StoneAmount);
  const miscAmt = parseValue(row.MiscAmount);
  return (netWt + wastage) * rate + mc + stoneAmt + miscAmt;
};

export const calculateGST = (row) => {
  const gstFromApi = parseValue(row.GSTAmount);
  if (gstFromApi > 0) {
    return gstFromApi;
  }
  const gross = calculateGrossAmount(row);
  let gstPer = parseFloat(row.GSTPer);
  if (isNaN(gstPer)) gstPer = 0;
  return (gross * gstPer) / 100;
};

export const calculateGrandTotal = (row) => {
  const grandTotalFromApi = parseValue(row.GrandTotal);
  if (grandTotalFromApi > 0) {
    return grandTotalFromApi;
  }
  return calculateGrossAmount(row) + calculateGST(row);
};