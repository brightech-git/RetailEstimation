// ItemTagService.js
// Migrated to the shared API layer (Src/api): single axios instance +
// backendManager (per-company base URL) + ENDPOINTS + logger + shared storage.
// No fetch, no manual URL building, no direct AsyncStorage, no console.
// Every endpoint, param, payload, response mapping, timeout and business rule
// (costId required, API base URL required) is preserved.
import { api, ENDPOINTS, backendManager } from "@api";
import { logger } from "@core/logger";
import { storage } from "@shared/utils";
import { useApiBaseUrl } from "../../Config/Config";

class ItemTagService {
  constructor(apiBaseUrl) {
    // The shared axios instance resolves its base URL from backendManager
    // (set at login). Seed it here too so a service constructed with an
    // explicit company URL still targets the correct backend. Kept for the
    // "not logged in yet" guard below.
    this.API_BASE_URL = apiBaseUrl || null;
    if (apiBaseUrl) backendManager.setCompanyUrl(apiBaseUrl);
  }

  // ===================== COMMON =====================

  async getCostId() {
    try {
      return await storage.get("SELECTED_COST_ID");
    } catch (e) {
      logger.warn("CostId error:", e);
      return null;
    }
  }

  // Builds the query params every request needs. Preserves the original rules:
  // API base URL must be present, costId must be present, and only
  // defined/non-null extra params are appended.
  async buildParams(params = {}) {
    if (!this.API_BASE_URL) {
      throw new Error(
        "API base URL missing - user is not logged in yet (or company URL failed to load)"
      );
    }

    const costId = await this.getCostId();
    if (!costId) throw new Error("costId missing");

    const out = { costId };
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        out[key] = params[key];
      }
    });
    return out;
  }

  log(label, url, data) {
    const length = Array.isArray(data)
      ? data.length
      : data?.itemTags?.length || 0;
    // (tracing kept off, as before)
    void label;
    void url;
    void length;
  }

  // ===================== STATS =====================

  async fetchStats(filters = {}) {
    try {
      const params = await this.buildParams(filters);
      const res = await api.get(ENDPOINTS.STOCK.SEARCH, { params });
      const data = res.data;

      this.log("Stats", ENDPOINTS.STOCK.SEARCH, data);

      const total = data.total || data.totalCount || 0;
      const totalUnchecked = data.totalUnchecked || 0;
      const totalChecked = data.totalChecked ?? total - totalUnchecked;

      return {
        totalCount: total,
        totalChecked,
        totalUnchecked,
      };
    } catch (err) {
      logger.warn("Stats error:", err);
      return { totalCount: 0, totalChecked: 0, totalUnchecked: 0 };
    }
  }

  // ===================== TABLE DATA =====================

  async fetchItemTags(filters = {}, page = 0, pageSize = 20) {
    try {
      const params = await this.buildParams({ ...filters, page, pageSize });
      const res = await api.get(ENDPOINTS.STOCK.SEARCH, { params });
      const data = res.data;

      this.log("ItemTags", ENDPOINTS.STOCK.SEARCH, data);

      const total = data.total || 0;

      return {
        itemTags: data.itemTags || [],
        totalCount: total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: data.page || 0,
        hasMore: data.hasMore || false,
      };
    } catch (err) {
      logger.warn("ItemTags error:", err);
      return {
        itemTags: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 0,
        hasMore: false,
      };
    }
  }

  // ===================== DROPDOWNS (FULL DATA) =====================

  async fetchMetalNames() {
    try {
      const params = await this.buildParams();
      const res = await api.get(ENDPOINTS.STOCK.METAL_NAMES, { params });
      const data = res.data;

      this.log("Metals", ENDPOINTS.STOCK.METAL_NAMES, data);

      return data || [];
    } catch (err) {
      logger.warn("Metals error:", err);
      return [];
    }
  }

  async fetchCounterNames() {
    try {
      const params = await this.buildParams();
      const res = await api.get(ENDPOINTS.STOCK.COUNTER_NAMES, { params });
      const data = res.data;

      this.log("Counters", ENDPOINTS.STOCK.COUNTER_NAMES, data);

      return data || [];
    } catch (err) {
      logger.warn("Counters error:", err);
      return [];
    }
  }

  async fetchItemsByMetal(metalId) {
    try {
      if (!metalId) return [];

      const params = await this.buildParams({ metalId });
      const res = await api.get(ENDPOINTS.STOCK.ITEMS_WITH_SUBITEMS, { params });
      const data = res.data;

      this.log("Items", ENDPOINTS.STOCK.ITEMS_WITH_SUBITEMS, data);

      if (Array.isArray(data)) {
        return data.map((item) => ({
          id: item.id ?? item.item_id,
          name: item.name ?? item.item_name,
          subitems: item.subitems || [],
        }));
      }

      return [];
    } catch (err) {
      logger.warn("Items error:", err);
      return [];
    }
  }

  async fetchSubItems(itemId, metalId) {
    try {
      if (!itemId || !metalId) return [];

      const params = await this.buildParams({ itemId, metalId });
      const res = await api.get(ENDPOINTS.STOCK.ITEMS_WITH_SUBITEMS, { params });
      const data = res.data;

      this.log("SubItems", ENDPOINTS.STOCK.ITEMS_WITH_SUBITEMS, data);

      if (Array.isArray(data)) {
        const match = data.find(
          (i) =>
            (i.id?.toString() ?? i.item_id?.toString()) === itemId.toString()
        );

        return match?.subitems || [];
      }

      return data?.subitems || [];
    } catch (err) {
      logger.warn("SubItems error:", err);
      return [];
    }
  }

  // ===================== UPDATE ITEM =====================
  async updateItemCheck(itemId, tagNo, subItemId, metalName, itemCtrId) {
    try {
      const params = await this.buildParams({
        itemId,
        tagNo,
        metalName,
        subItemId,
        itemCtrId,
      });

      logger.debug("Update API", ENDPOINTS.STOCK.UPDATE_CHECK);

      const res = await api.put(ENDPOINTS.STOCK.UPDATE_CHECK, null, { params });
      const data = res.data;

      logger.debug("Update response:", data);

      return data;
    } catch (err) {
      logger.warn("Update error:", err);
      throw err;
    }
  }

  // ===================== INITIAL LOAD =====================

  async loadAllDropdownData() {
    try {
      const [metals, counters] = await Promise.all([
        this.fetchMetalNames(),
        this.fetchCounterNames(),
      ]);

      return {
        metals,
        counters,
        items: [],
        subItems: [],
      };
    } catch (err) {
      logger.warn("Dropdown load error:", err);
      return {
        metals: [],
        counters: [],
        items: [],
        subItems: [],
      };
    }
  }
}

// Hook
export const useItemTagService = () => {
  const API_BASE_URL = useApiBaseUrl();
  return new ItemTagService(API_BASE_URL);
};

export default ItemTagService;
