import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

export class SoftControlService {
  constructor(apiBaseUrl) {
    this.api = createApiInstance(apiBaseUrl);
  }

  // Read several settings from one response containing the full control list.
  async getControlValues(costId, ctlIds) {
    const response = await this.api.get(ENDPOINTS.SOFT_CONTROL, {
      params: { costId },
    });
    const rows = Array.isArray(response.data) ? response.data : [response.data];
    return Object.fromEntries(ctlIds.map((id) => [id, this.selectControlValue(rows, costId, id)]));
  }

  selectControlValue(data, costId, ctlId) {
    const matches = data.filter((row) =>
      String(row?.ctl_id ?? row?.ctlId ?? row?.CTL_ID ?? row?.CTLID ?? '').trim().toUpperCase() === String(ctlId).trim().toUpperCase()
    );
    const rowCost = (row) => String(row?.cost_id ?? row?.costId ?? row?.COST_ID ?? '').trim();
    const found = matches.find((row) => rowCost(row) === String(costId || '').trim())
      || matches.find((row) => rowCost(row) === '')
      || (data.length === 1 && !data[0]?.ctl_id && !data[0]?.ctlId && !data[0]?.CTL_ID && !data[0]?.CTLID ? data[0] : undefined);
    const value = found?.ctlText ?? found?.ctl_text ?? found?.CTLTEXT ?? found?.CTL_TEXT ?? '';
    if (String(ctlId).trim().toUpperCase() === 'ESTITEMORSUBITEM') {
      console.log('[ESTITEMORSUBITEM] soft control', JSON.stringify({
        requestedCostId: costId, matchingRows: matches,
        selectedRow: found ?? null, ctlText: value,
      }));
    }
    return value;
  }

  async getControlValue(costId, ctlId) {
    console.log('[SoftControl] request starting', JSON.stringify({
      endpoint: ENDPOINTS.SOFT_CONTROL, costId: costId || '', ctlId,
    }));
    try {
      const response = await this.api.get(ENDPOINTS.SOFT_CONTROL, {
        params: { costId, ctlId },
      });
      console.log('📥 SoftControl raw response for', ctlId, ':', JSON.stringify(response.data));
      const data = Array.isArray(response.data) ? response.data : [response.data];
      const val = this.selectControlValue(data, costId, ctlId);
      console.log('🔎 getControlValue(', ctlId, ') =>', val || 'NOT FOUND');
      return val;
    } catch (err) {
      console.log('[SoftControl] request failed', JSON.stringify({
        ctlId, costId: costId || '', status: err?.response?.status ?? null,
        message: err.message,
      }));
      console.log('❌ SoftControl error for', ctlId, ':', err?.response?.status, JSON.stringify(err?.response?.data), err.message);
      return "";
    }
  }
}
