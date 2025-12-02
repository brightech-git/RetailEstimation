import axios from "axios";

export class EstimationService {
  constructor(apiBaseUrl) {
    this.api = axios.create({
      baseURL: apiBaseUrl,
    });
  }

  // Data fetching methods
  async fetchItemList() {
    const response = await this.api.get("/list");
    const data = response.data;
    const uniqueItemIds = Array.from(new Set(data.map((item) => item.ITEMID)));
    return uniqueItemIds;
  }

  async fetchEstimationData(ITEMID, TAGNO) {
    const response = await this.api.get("/estimationTotal", {
      params: { ITEMID, TAGNO },
    });
    return response.data;
  }

  async checkTagExists(ITEMID, TAGNO) {
    try {
      const response = await this.api.get(`/tag-details`, {
        params: { ITEMID, TAGNO },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
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
    });
    return response.data;
  }

  async getStoneInputs(itemId, tagNo) {
    try {
      const response = await this.api.get("/stnInputs", {
        params: { itemid: itemId, tagno: tagNo },
      });
      return response.data || [];
    } catch (err) {
      console.warn(`Failed to fetch stone inputs`, err);
      return [];
    }
  }

  async getStoneCategoryCode(itemId, stnItemId) {
    try {
      const response = await this.api.get("/stone-catcode", {
        params: { itemId, stnItemId },
      });
      return response.data?.stoneCatCode || "";
    } catch (err) {
      console.warn(`Failed to fetch catCode`, err);
      return "";
    }
  }

  async getTagDetails(tagNo) {
    try {
      const response = await this.api.get(`/tagDetails/${tagNo}`);
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

  async getEstimationDetails(tranno) {
    const response = await this.api.get(`/details/${tranno}`);
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