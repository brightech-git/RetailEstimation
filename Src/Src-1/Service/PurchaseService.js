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
   * Backward-compatible purchase save. Purchase rows are now always sent in
   * the combined estissue-receipt envelope.
   */
  async saveReceipt(payload) {
    const response = await this.api.post(ENDPOINTS.EST_ISSUE_RECEIPT, {
      issues: [],
      receipts: payload,
    });
    console.log("✅ Purchase response:", JSON.stringify(response?.data, null, 2));
    const receipts = response?.data?.receipts;
    return Array.isArray(receipts) ? receipts[0] : response?.data?.receipt || response?.data;
  }
}
