// EstimationService.js
// Migrated to the shared API layer (Src/api): single axios instance +
// backendManager (per-company base URL) + ENDPOINTS registry + logger.
// No local axios instance, no base-URL construction, no direct AsyncStorage.
// Every request payload, endpoint, response mapping, timeout and business
// calculation is preserved exactly.
import { api, ENDPOINTS, backendManager } from "@api";
import { logger } from "@core/logger";
import { storage } from "@shared/utils";

export class EstimationService {
  constructor(apiBaseUrl) {
    // The shared axios instance resolves its base URL from backendManager
    // (set at login). Seed it here too so a service constructed with an
    // explicit company URL still targets the correct backend.
    if (apiBaseUrl) backendManager.setCompanyUrl(apiBaseUrl);
  }

  // Internal request wrapper. Defaults to NO timeout (matching the previous
  // axios.create, which set none) unless a call specifies one. Errors reject
  // as the shared ApiError ({ message, status, data }); consumers read
  // error.data / error.message directly.
  async request(config) {
    return api.request({ timeout: 0, ...config });
  }

  // Centralized costId accessor - single source of truth for the
  // logged-in user's selected cost centre (set by LoginContext).
  async getCostId() {
    try {
      return (await storage.get("SELECTED_COST_ID")) || "";
    } catch (e) {
      logger.warn("Failed to read SELECTED_COST_ID:", e);
      return "";
    }
  }

  // Data fetching methods
  async fetchItemList(costId) {
    const resolvedCostId = costId || (await this.getCostId());
    const response = await this.request({
      method: "get",
      url: ENDPOINTS.ESTIMATION.ITEM_LIST,
      params: { costId: resolvedCostId || undefined },
    });
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
    const response = await this.request({
      method: "get",
      url: ENDPOINTS.ESTIMATION.GET_ESTIMATION,
      params: { ITEMID, TAGNO, COSTID: costId || "" },
    });
    return response.data;
  }

  async checkTagExists(ITEMID, TAGNO) {
    try {
      const costId = await this.getCostId();
      const response = await this.request({
        method: "get",
        url: ENDPOINTS.ESTIMATION.TAG_DETAILS,
        params: { ITEMID, TAGNO, COSTID: costId || "" },
      });
      return response.data;
    } catch (error) {
      // Without a real cost centre this lookup can fail server-side
      // (404/500) rather than returning "not issued" - either way, treat
      // it as "couldn't verify, let the user continue" instead of
      // blocking the whole screen.
      logger.warn("checkTagExists failed, continuing without it:", error);
      return null;
    }
  }

  async getTransactionNumber(costId, companyId) {
    const response = await this.request({
      method: "get",
      url: ENDPOINTS.ESTIMATION.TRAN_NO,
      params: { costId, companyId },
     
    });
     console.log("params", { costId, companyId });
    return response.data;
  }

  async getEstimationBatchNo(costId, companyId) {
    const today = new Date().toISOString().split("T")[0];
    const response = await this.request({
      method: "get",
      url: ENDPOINTS.ESTIMATION.BATCH_NO,
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
      const response = await this.request({
        method: "get",
        url: ENDPOINTS.ESTIMATION.STONE_INPUTS,
        params: { itemid: itemId, tagno: tagNo, costId: resolvedCostId || undefined },
      });
      return response.data || [];
    } catch (err) {
      logger.warn(`Failed to fetch stone inputs`, err);
      return [];
    }
  }

  async getStoneCategoryCode(itemId, stnItemId, costId) {
    try {
      const resolvedCostId = costId || (await this.getCostId());
      const response = await this.request({
        method: "get",
        url: ENDPOINTS.ESTIMATION.STONE_CATCODE,
        params: { itemId, stnItemId, costId: resolvedCostId || undefined },
      });
      return response.data?.stoneCatCode || "";
    } catch (err) {
      logger.warn(`Failed to fetch catCode`, err);
      return "";
    }
  }

  async getTagDetails(tagNo, costId) {
    try {
      const resolvedCostId = costId || (await this.getCostId());
      const response = await this.request({
        method: "get",
        url: `${ENDPOINTS.TAG.GET_TAG}/${tagNo}`,
        params: { costId: resolvedCostId || undefined },
      });
      return response.data || {};
    } catch (err) {
      logger.warn(`Failed to fetch tag details`, err);
      return {};
    }
  }

  async getTransactionDate(ITEMID, TAGNO, costId) {
    try {
      const resolvedCostId = costId || (await this.getCostId());
      const response = await this.request({
        method: "get",
        url: ENDPOINTS.ESTIMATION.TRAN_DATE,
        params: { ITEMID, TAGNO, costId: resolvedCostId || undefined },
      });
      return response.data?.trandate;
    } catch (err) {
      logger.warn(`Failed to fetch trandate`, err);
      return null;
    }
  }

  async generateEstissStoneSno(costId, companyId) {
    try {
      const response = await this.request({
        method: "get",
        url: ENDPOINTS.ESTIMATION.GEN_STONE_SNO,
        params: { costId, companyId },
      });
      return response.data || "";
    } catch (err) {
      logger.warn(`Failed to generate SNO`, err);
      return "";
    }
  }

  async generateEstTaxTranSno(costId, companyId) {
    try {
      const response = await this.request({
        method: "get",
        url: ENDPOINTS.ESTIMATION.GEN_TAX_SNO,
        params: { costId, companyId },
      });
      return String(response.data || "");
    } catch (err) {
      logger.warn(`Failed to generate ESTTAXTRAN SNO:`, err);
      return "";
    }
  }

  async getTaxDetails(itemId, costId) {
    try {
      const resolvedCostId = costId || (await this.getCostId());
      const response = await this.request({
        method: "get",
        url: `${ENDPOINTS.ESTIMATION.TAX_DETAILS}/${itemId}`,
        params: { costId: resolvedCostId || undefined },
      });
      return response?.data?.[0] || {};
    } catch (err) {
      logger.warn(`Failed to fetch tax details for ITEMID=${itemId}`, err);
      return {};
    }
  }

  // Data submission methods
  async submitEstimationData(data) {
    const response = await this.request({
      method: "post",
      url: ENDPOINTS.ESTIMATION.SAVE_ISSUE,
      data,
    });
    logger.debug("Save response:", response.data);
    return response.data;
  }

  async submitStoneData(data) {
    const response = await this.request({
      method: "post",
      url: ENDPOINTS.ESTIMATION.SAVE_STONE_ISSUE,
      data,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data;
  }

  async submitTaxData(data) {
    const response = await this.request({
      method: "post",
      url: ENDPOINTS.ESTIMATION.SAVE_TAX,
      data,
    });
    return response.data;
  }

  async updateTransactionNumber(costId) {
    const resolvedCostId = costId || (await this.getCostId());
    const response = await this.request({
      method: "post",
      url: ENDPOINTS.ESTIMATION.UPDATE_TRAN_NO,
      params: { costId: resolvedCostId || undefined },
    });
    return response.data;
  }

  async getIPAddress(costId) {
    const resolvedCostId = costId || (await this.getCostId());
    const response = await this.request({
      method: "get",
      url: ENDPOINTS.ESTIMATION.IP_ADDRESS,
      params: { costId: resolvedCostId || undefined },
    });
    return response.data?.ip || response.data || "";
  }

  async getEstimationDetails(tranno, costId) {
    const resolvedCostId = costId || (await this.getCostId());
    const response = await this.request({
      method: "get",
      url: `${ENDPOINTS.ESTIMATION.DETAILS}/${tranno}`,
      params: { costId: resolvedCostId || undefined },
    });
    return response.data?.[0] || {};
  }

  async getTodayRates(costId) {
    const resolvedCostId = costId || (await this.getCostId());
    const response = await this.request({
      method: "get",
      url: ENDPOINTS.RATE.TODAY_RATE,
      params: { costId: resolvedCostId || undefined },
    });
    return response.data;
  }

  async submitPrintData(data, costId) {
    const resolvedCostId = costId || (await this.getCostId());
    const response = await this.request({
      method: "post",
      url: ENDPOINTS.ESTIMATION.PRINT,
      data: { ...data, costId: resolvedCostId || undefined },
    });
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
