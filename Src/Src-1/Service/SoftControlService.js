import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class SoftControlService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  /**
   * Fetch all soft controls for a given costId.
   * @param {string} costId
   * @returns {Promise<import("../types/SoftControl").SoftControl[]>}
   */
  async getSoftControls(costId) {
    const response = await this.api.get(ENDPOINTS.SOFT_CONTROL, {
      params: { costId },
    });
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Get a single soft control value by ctlId.
   * @param {string} costId
   * @param {string} ctlId
   * @returns {Promise<string>} ctlText value or ""
   */
  async getControlValue(costId, ctlId) {
    const controls = await this.getSoftControls(costId);
    const found = controls.find((c) => c.ctlId === ctlId);
    return found?.ctlText || "";
  }
}
