import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class EstimationService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  async getCostId() {
    // COSTID is now auto-appended by axiosInstance interceptor (uppercase)
    // This method is kept for backward compatibility with UseEstimation.js
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    try {
      return (await AsyncStorage.getItem("SELECTED_COST_ID")) || "";
    } catch (e) {
      console.warn("Failed to read SELECTED_COST_ID:", e);
      return "";
    }
  }

  // ── GET ──────────────────────────────────────────────────────────────

  async fetchItemList() {
    const response = await this.api.get(ENDPOINTS.LIST);
    const data = response.data;
    return Array.from(new Set(data.map((item) => item.ITEMID)));
  }

  async fetchEstimationData(ITEMID, TAGNO) {
    const response = await this.api.get(ENDPOINTS.ESTIMATION_TOTAL, {
      params: { ITEMID, TAGNO },  // costId appended by interceptor (lowercase)
    });
    return response.data;
  }

  async checkTagExists(ITEMID, TAGNO) {
    try {
      const response = await this.api.get(ENDPOINTS.TAG_DETAILS, {
        params: { ITEMID, TAGNO },
        validateStatus: (status) => [200, 404, 500].includes(status),
      });
      if (response.status === 404) return { status: "not issued", trandate: null };
      return response.data;
    } catch (error) {
      console.warn("tag-details check failed, continuing without it:", error.response?.status || error.message);
      return null;
    }
  }

  async getTransactionNumber() {
    const response = await this.api.get(ENDPOINTS.TRANNO);
    return response.data;
  }

  async getEstimationBatchNo(costId, companyId) {
    const today = new Date().toISOString().split("T")[0];
    const response = await this.api.get(ENDPOINTS.EST_BATCH_NO, {
      params: { costId, billDate: today, companyId, isEstimate: true },
      timeout: 15000,
    });
    return response.data;
  }

  async getStoneInputs(itemId, tagNo) {
    try {
      const response = await this.api.get(ENDPOINTS.STN_INPUTS, {
        params: { itemid: itemId, tagno: tagNo },
      });
      return response.data || [];
    } catch (err) {
      console.warn("Failed to fetch stone inputs", err);
      return [];
    }
  }

  async getStoneCategoryCode(itemId, stnItemId) {
    try {
      const response = await this.api.get(ENDPOINTS.STONE_CATCODE, {
        params: { itemId, stnItemId },
      });
      return response.data?.stoneCatCode || "";
    } catch (err) {
      console.warn("Failed to fetch catCode", err);
      return "";
    }
  }

  async getTagDetails(tagNo) {
    try {
      const response = await this.api.get(ENDPOINTS.TAG_DETAILS_BY_TAGNO(tagNo));
      return response.data || {};
    } catch (err) {
      console.warn("Failed to fetch tag details", err);
      return {};
    }
  }

  async getTransactionDate(ITEMID, TAGNO) {
    try {
      const response = await this.api.get(ENDPOINTS.TRAN_DATE, {
        params: { ITEMID, TAGNO },
      });
      return response.data?.trandate;
    } catch (err) {
      console.warn("Failed to fetch trandate", err);
      return null;
    }
  }

  async generateEstissStoneSno(costId, companyId) {
    try {
      const response = await this.api.get(ENDPOINTS.GENERATE_ESTISSSTONE_SNO, {
        params: { costId, companyId },
      });
      return response.data || "";
    } catch (err) {
      console.warn("Failed to generate SNO", err);
      return "";
    }
  }

  async generateEstTaxTranSno(costId, companyId) {
    try {
      const response = await this.api.get(ENDPOINTS.GENERATE_ESTTAXTRAN_SNO, {
        params: { costId, companyId },
      });
      return String(response.data || "");
    } catch (err) {
      console.warn("Failed to generate ESTTAXTRAN SNO:", err);
      return "";
    }
  }

  async getTaxDetails(itemId) {
    try {
      const response = await this.api.get(ENDPOINTS.TAX_DETAILS(itemId));
      return response?.data?.[0] || {};
    } catch (err) {
      console.warn(`Failed to fetch tax details for ITEMID=${itemId}`, err);
      return {};
    }
  }

  async getEstimationDetails(tranno) {
    const response = await this.api.get(ENDPOINTS.EST_DETAILS(tranno));
    return response.data?.[0] || {};
  }

  async getTodayRates() {
    const response = await this.api.get(ENDPOINTS.TODAY_RATE);
    return response.data;
  }

  async getIPAddress() {
    const response = await this.api.get(ENDPOINTS.IP_ADDRESS);
    return response.data?.ip || response.data || "";
  }

  // ── POST ─────────────────────────────────────────────────────────────

  async getOffer(tagNo) {
    try {
      const response = await this.api.post(ENDPOINTS.OFFER, null, {
        params: { tagno: tagNo },
      });
      return response.data || {};
    } catch (err) {
      console.warn("Failed to fetch offer", err);
      return {};
    }
  }

  async submitEstimationData(data) {
    const response = await this.api.post(ENDPOINTS.EST_ISSUE, data);
    console.log("Save response:", response.data);
    return response.data;
  }

  async submitStoneData(data) {
    const response = await this.api.post(ENDPOINTS.EST_STN_ISSUE, data, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data;
  }

  async submitTaxData(data) {
    const response = await this.api.post(ENDPOINTS.EST_TAX_TRAN, data);
    return response.data;
  }

  async updateTransactionNumber() {
    const response = await this.api.post(ENDPOINTS.UPDATE_TRANNO);
    return response.data;
  }

  async submitPrintData(data) {
    const response = await this.api.post(ENDPOINTS.EST_PRINT, data);
    return response.data;
  }
}

// ── Utility functions ─────────────────────────────────────────────────

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

// NOTE: gross/GST/grand-total calculations used to be duplicated here with
// a stale, drifted formula (undiscounted gross as GST taxable base, 0%
// default GST rate). They were unused anywhere in the app (confirmed) and
// have been removed — the single source of truth now lives in
// Src/shared/EstimationCalculations.js (calcGross/calcGST/calcGrandTotal).
