import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class PurchaseService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  /**
   * Category + item rows for Purchase entry (one row per item, with
   * catCode/catName/itemId/itemName/subItemId/purity/prate…).
   * @returns {Promise<object[]>}
   */
  async getCategories() {
    const response = await this.api.get(ENDPOINTS.CATEGORY_SEARCH);
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Save purchase rows (/estreceipt).
   * @param {object[]} payload
   * @returns {Promise<{tranno, estbatchno}|undefined>} first saved record
   */
  async saveReceipt(payload) {
    const response = await this.api.post(`${ENDPOINTS.EST_RECEIPT}?costId=`, payload);
    console.log("✅ Purchase response:", JSON.stringify(response?.data, null, 2));
    return Array.isArray(response?.data) ? response.data[0] : response?.data;
  }
}
