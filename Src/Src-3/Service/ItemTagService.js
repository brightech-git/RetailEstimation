import { useApiBaseUrl } from "../../Config/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ItemTagService {
  constructor(apiBaseUrl) {
    // No hardcoded fallback: each company has its own backend, resolved
    // at login (LoginContext.companyUrl / useApiBaseUrl). If it's not
    // available yet, calls should fail loudly rather than silently hit
    // another company's server.
    this.API_BASE_URL = apiBaseUrl || null;
  }

  // ===================== COMMON =====================

  async getCostId() {
    try {
      return await AsyncStorage.getItem("SELECTED_COST_ID");
    } catch (e) {
      console.log("CostId error:", e);
      return null;
    }
  }

  async buildUrl(endpoint, params = {}) {
    if (!this.API_BASE_URL) {
      throw new Error(
        "API base URL missing - user is not logged in yet (or company URL failed to load)"
      );
    }

    const costId = await this.getCostId();

    if (!costId) throw new Error("costId missing");

    const url = new URL(`${this.API_BASE_URL}${endpoint}`);
    url.searchParams.append("costId", costId);

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return url;
  }

  log(label, url, data) {
    const length = Array.isArray(data)
      ? data.length
      : data?.itemTags?.length || 0;

    // console.log(`🔹 ${label}`);
    // console.log("URL:", url);
    // console.log("Length:", length);
  }

  // ===================== STATS =====================

  async fetchStats(filters = {}) {
    try {
      const url = await this.buildUrl("/itemtag/filter", filters);
      const res = await fetch(url.toString());
      const data = await res.json();

      this.log("Stats", url.toString(), data);

      const total = data.total || data.totalCount || 0;
      const totalUnchecked = data.totalUnchecked || 0;
      const totalChecked =
        data.totalChecked ?? total - totalUnchecked;

      return {
        totalCount: total,
        totalChecked,
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
      const url = await this.buildUrl("/itemtag/filter", {
        ...filters,
        page,
        pageSize,
      });

      const res = await fetch(url.toString());
      const data = await res.json();

      this.log("ItemTags", url.toString(), data);

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
      const url = await this.buildUrl("/metalnames");
      const res = await fetch(url.toString());
      const data = await res.json();

      this.log("Metals", url.toString(), data);

      return data || [];
    } catch (err) {
      console.log("Metals error:", err);
      return [];
    }
  }

  async fetchCounterNames() {
    try {
      const url = await this.buildUrl("/itemctrnames");
      const res = await fetch(url.toString());
      const data = await res.json();

      this.log("Counters", url.toString(), data);

      return data || [];
    } catch (err) {
      console.log("Counters error:", err);
      return [];
    }
  }

  async fetchItemsByMetal(metalId) {
    try {
      if (!metalId) return [];

      const url = await this.buildUrl(
        "/itemtag/itemnames-with-subitems",
        { metalId }
      );

      const res = await fetch(url.toString());
      const data = await res.json();

      this.log("Items", url.toString(), data);

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

      const url = await this.buildUrl(
        "/itemtag/itemnames-with-subitems",
        { itemId, metalId }
      );

      const res = await fetch(url.toString());
      const data = await res.json();

      this.log("SubItems", url.toString(), data);

      if (Array.isArray(data)) {
        const match = data.find(
          (i) =>
            (i.id?.toString() ?? i.item_id?.toString()) ===
            itemId.toString()
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
    const url = await this.buildUrl("/itemtag/updateCheck", {
      itemId,
      tagNo,
      metalName,
      subItemId,
      itemCtrId,
    });

    console.log("🔹 Update API");
    console.log("URL:", url.toString());

    const res = await fetch(url.toString(), {
      method: "PUT", // ✅ MUST be PUT
    });

    const data = await res.json();

    console.log("RESPONSE:", data);

    return data;
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

      return {
        metals,
        counters,
        items: [],
        subItems: [],
      };
    } catch (err) {
      console.log("Dropdown load error:", err);
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