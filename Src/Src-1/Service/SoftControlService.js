import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class SoftControlService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  async getSoftControls(costId) {
    const response = await this.api.get(ENDPOINTS.SOFT_CONTROL, {
      params: { costId },
    });
    const data = Array.isArray(response.data) ? response.data : [];
    console.log('📋 SoftControls count:', data.length, '| keys:', data[0] ? Object.keys(data[0]) : 'empty');
    return data;
  }

  async getControlValue(costId, ctlId) {
    const controls = await this.getSoftControls(costId);
    const found = controls.find(
      (c) => (c.ctlId || c.ctl_id) === ctlId
    );
    const val = found?.ctlText ?? found?.ctl_text ?? "";
    console.log('🔎 getControlValue(', ctlId, ') =>', val || 'NOT FOUND');
    return val;
  }
}
