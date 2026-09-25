import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class RateService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  /**
   * Today's board rates.
   * @returns {Promise<{GOLDRATE: number, SILVERRATE: number}>}
   */
  async getTodayRate() {
    const response = await this.api.get(ENDPOINTS.TODAY_RATE);
    return response.data || {};
  }
}
