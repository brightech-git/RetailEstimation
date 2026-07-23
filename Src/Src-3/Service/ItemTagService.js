import { useApiBaseUrl } from "../../Config/Config";
import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

class ItemTagService {
  constructor(apiBaseUrl) {
    if (!apiBaseUrl) {
      throw new Error(
        "API base URL missing - user is not logged in yet (or company URL failed to load)"
      );
    }
    this.api = createApiInstance(apiBaseUrl);
  }

  // ===================== STATS =====================

  async fetchStats(filters = {}) {
    try {
      const res = await this.api.get(ENDPOINTS.ITEMTAG_FILTER, { params: filters });
      const data = res.data;
      const total = data.total || data.totalCount || 0;
      const totalUnchecked = data.totalUnchecked || 0;
      return {
        totalCount: total,
        totalChecked: data.totalChecked ?? total - totalUnchecked,
        totalUnchecked,
      };
    } catch (err) {
      console.log("Stats error:", err);
      return { totalCount: 0, totalChecked: 0, totalUnchecked: 0 };
    }
  }

  // ===================== TABLE DATA =====================

  async fetchItemTags(filters = {}, page = 0, pageSize = 20) {
    try {
      const res = await this.api.get(ENDPOINTS.ITEMTAG_FILTER, {
        params: { ...filters, page, pageSize },
      });
      const data = res.data;
      const total = data.total || 0;
      return {
        itemTags: data.itemTags || [],
        totalCount: total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: data.page || 0,
        hasMore: data.hasMore || false,
      };
    } catch (err) {
      console.log("ItemTags error:", err);
      return { itemTags: [], totalCount: 0, totalPages: 0, currentPage: 0, hasMore: false };
    }
  }

  // ===================== DROPDOWNS =====================

  async fetchMetalNames() {
    try {
      const res = await this.api.get(ENDPOINTS.METAL_NAMES);
      return res.data || [];
    } catch (err) {
      console.log("Metals error:", err);
      return [];
    }
  }

  async fetchCounterNames() {
    try {
      const res = await this.api.get(ENDPOINTS.COUNTER_NAMES);
      return res.data || [];
    } catch (err) {
      console.log("Counters error:", err);
      return [];
    }
  }

  async fetchItemsByMetal(metalId) {
    try {
      if (!metalId) return [];
      const res = await this.api.get(ENDPOINTS.ITEMTAG_NAMES, { params: { metalId } });
      const data = res.data;
      if (Array.isArray(data)) {
        return data.map((item) => ({
          id: item.id ?? item.item_id,
          name: item.name ?? item.item_name,
          subitems: item.subitems || [],
        }));
      }
      return [];
    } catch (err) {
      console.log("Items error:", err);
      return [];
    }
  }

  async fetchSubItems(itemId, metalId) {
    try {
      if (!itemId || !metalId) return [];
      const res = await this.api.get(ENDPOINTS.ITEMTAG_NAMES, { params: { itemId, metalId } });
      const data = res.data;
      if (Array.isArray(data)) {
        const match = data.find(
          (i) => (i.id?.toString() ?? i.item_id?.toString()) === itemId.toString()
        );
        return match?.subitems || [];
      }
      return data?.subitems || [];
    } catch (err) {
      console.log("SubItems error:", err);
      return [];
    }
  }

  // ===================== UPDATE ITEM =====================

  async updateItemCheck(itemId, tagNo, subItemId, metalName, itemCtrId) {
    try {
      const res = await this.api.put(ENDPOINTS.ITEMTAG_UPDATE_CHECK, null, {
        params: { itemId, tagNo, metalName, subItemId, itemCtrId },
      });
      console.log("RESPONSE:", res.data);
      return res.data;
    } catch (err) {
      console.log("Update error:", err);
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
      return { metals, counters, items: [], subItems: [] };
    } catch (err) {
      console.log("Dropdown load error:", err);
      return { metals: [], counters: [], items: [], subItems: [] };
    }
  }
}

export const useItemTagService = () => {
  const API_BASE_URL = useApiBaseUrl();
  return new ItemTagService(API_BASE_URL);
};

export default ItemTagService;
