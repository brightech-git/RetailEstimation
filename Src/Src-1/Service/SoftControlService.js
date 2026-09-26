import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class SoftControlService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  async getControlValue(costId, ctlId) {
    try {
      const response = await this.api.get(ENDPOINTS.SOFT_CONTROL, {
        params: { costId, ctlId },
      });
      console.log('📥 SoftControl raw response for', ctlId, ':', JSON.stringify(response.data));
      const data = Array.isArray(response.data) ? response.data : [response.data];
      const found = data[0];
      const val = found?.ctlText ?? found?.ctl_text ?? found?.CTLTEXT ?? found?.CTL_TEXT ?? "";
      console.log('🔎 getControlValue(', ctlId, ') =>', val || 'NOT FOUND');
      return val;
    } catch (err) {
      console.log('❌ SoftControl error for', ctlId, ':', err?.response?.status, JSON.stringify(err?.response?.data), err.message);
      return "";
    }
  }
}
