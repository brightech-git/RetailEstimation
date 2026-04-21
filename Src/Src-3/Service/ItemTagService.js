import { useApiBaseUrl } from "../../Config/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ItemTagService {
  constructor(apiBaseUrl) {
   this.API_BASE_URL = apiBaseUrl || "https://est.bmgjewellers.com/api/v1";
  }

  async #getCostId() {
    try {
      const costId = await AsyncStorage.getItem("SELECTED_COST_ID");
      return costId || null;
    } catch {
      return null;
    }
  }

  async #request(endpoint, options = {}, params = {}) {
    try {
      const url = new URL(`${this.API_BASE_URL}${endpoint}`);

      const costId = await this.#getCostId();
      if (costId) url.searchParams.append("costId", costId);

      Object.keys(params).forEach((key) => {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          url.searchParams.append(key, String(params[key]));
        }
      });

      console.log("API URL:", url.toString());
      const res = await fetch(url.toString(), options);
      return await res.json();
    } catch (err) {
      console.log("API error:", err);
      throw err;
    }
  }

  async fetchFilteredRaw(filters = {}) {
    try {
      return await this.#request("/itemtag/filter", {}, filters);
    } catch {
      return {};
    }
  }

  async fetchItemTags(filters = {}, page = 0, pageSize = 20) {
    try {
      const data = await this.#request(
        "/itemtag/filter",
        {},
        { ...filters, page, pageSize },
      );
      return {
        itemTags: data.itemTags || [],
        totalCount: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / pageSize),
        currentPage: data.page || 0,
        hasMore: data.hasMore || false,
        pageSize: data.pageSize || pageSize,
        totalChecked: data.totalChecked || 0,
        totalUnchecked: data.totalUnchecked || 0,
      };
    } catch {
      return {
        itemTags: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 0,
        hasMore: false,
        totalChecked: 0,
        totalUnchecked: 0,
      };
    }
  }

  async updateItemCheck(itemId, tagNo, subItemId, metalId, itemCtrId) {
    try {
      return await this.#request(
        "/itemtag/updateCheck",
        { method: "PUT", headers: { "Content-Type": "application/json" } },
        { itemId, tagNo, subItemId, metalName: metalId, itemCtrId },
      );
    } catch {
      return { status: "failed", message: "Something went wrong" };
    }
  }

  async fetchMetalNames() {
    try {
      return (await this.#request("/metalnames")) || [];
    } catch {
      return [];
    }
  }

  extractCounters(filterData) {
    const seen = new Set();
    return (filterData.itemTags || []).reduce((acc, item) => {
      if (item.ITEMCTRID && !seen.has(item.ITEMCTRID)) {
        seen.add(item.ITEMCTRID);
        acc.push({ id: item.ITEMCTRID, name: item.ITEMCTRNAME });
      }
      return acc;
    }, []);
  }

  extractItems(filterData) {
    const seen = new Set();
    return (filterData.itemTags || []).reduce((acc, item) => {
      if (item.ITEMID && !seen.has(item.ITEMID)) {
        seen.add(item.ITEMID);
        acc.push({ id: item.ITEMID, name: item.ITEMNAME });
      }
      return acc;
    }, []);
  }

  extractSubItems(filterData) {
    const seen = new Set();
    return (filterData.itemTags || []).reduce((acc, item) => {
      if (item.SUBITEMID && !seen.has(item.SUBITEMID)) {
        seen.add(item.SUBITEMID);
        acc.push({ id: item.SUBITEMID, name: item.SUBITEMNAME });
      }
      return acc;
    }, []);
  }

async loadAllDropdownData() {
    try {
      const [metals, filterData] = await Promise.all([
        this.fetchMetalNames(),
        this.fetchFilteredRaw({}), // no metalId = all counters for costId
      ]);

      return {
        metals: metals || [],
        counters: this.extractCounters(filterData), // populated on init
        items: [],
        subItems: [],
      };
    } catch {
      return { metals: [], counters: [], items: [], subItems: [] };
    }
  }

  async fetchDropdownsByMetal(metalId) {
    try {
      if (!metalId) return { items: [], counters: [] };
      const data = await this.fetchFilteredRaw({ metalId });
      return {
        items: this.extractItems(data),
        counters: this.extractCounters(data),
      };
    } catch {
      return { items: [], counters: [] };
    }
  }

  async fetchSubItems(itemId, metalId) {
    try {
      if (!itemId || !metalId) return [];
      const data = await this.fetchFilteredRaw({ metalId, itemId });
      return this.extractSubItems(data);
    } catch {
      return [];
    }
  }
}

export const useItemTagService = () => {
  const API_BASE_URL = useApiBaseUrl();
  return new ItemTagService(API_BASE_URL);
};

export default ItemTagService;
