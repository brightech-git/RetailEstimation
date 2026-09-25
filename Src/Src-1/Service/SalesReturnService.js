import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

// costId is auto-injected by the axios interceptor (Api/axiosInstance.js).
export class SalesReturnService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  /**
   * Sale bills for a date, one row per item line.
   * @param {string} billDate YYYY-MM-DD
   * @returns {Promise<{billNo, billDate, itemId, itemName, catName, grswt, amount, batchNo}[]>}
   */
  async getBills(billDate) {
    const response = await this.api.get(ENDPOINTS.SALE_RETURN_BILLS, {
      params: { billDate },
    });
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Item lines of one sale bill.
   * @param {string|number} tranNo bill no
   * @param {string} [billDate] YYYY-MM-DD — left out when looking up by bill no only
   * @returns {Promise<object[]>}
   */
  async getBillDetail(tranNo, billDate) {
    const params = { tranNo };
    if (billDate) params.billDate = billDate;
    const response = await this.api.get(ENDPOINTS.SALE_RETURN_DETAIL, { params });
    return Array.isArray(response.data) ? response.data : [];
  }
}
