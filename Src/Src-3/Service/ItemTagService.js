// services/ItemTagService.js
import { useApiBaseUrl } from "../../Config/Config";

class ItemTagService {
  constructor(apiBaseUrl) {
    this.API_BASE_URL = apiBaseUrl;
  }

  // ===================== SERVICE METHODS =====================

  // Fetch item tags with filters and pagination
  async fetchItemTags(filters = {}, page = 0, pageSize = 20) {
    try {
      const url = new URL(`${this.API_BASE_URL}/itemtag/filter`);

      // Add pagination parameters (your API uses page starting from 0)
      url.searchParams.append("page", page);
      url.searchParams.append("pageSize", pageSize);

      // Add filter parameters
      if (filters.itemId) url.searchParams.append("itemId", filters.itemId);
      if (filters.metalId) url.searchParams.append("metalId", filters.metalId);
      if (filters.subItemId) url.searchParams.append("subItemId", filters.subItemId);
      if (filters.itemCtrId) url.searchParams.append("itemCtrId", filters.itemCtrId);

      const res = await fetch(url.toString());
      const data = await res.json();
      
      // Transform API response to match our expected format
      return {
        itemTags: data.itemTags || [],
        totalCount: data.total || 0,
        totalPages: Math.ceil(data.total / pageSize),
        currentPage: data.page || 0,
        hasMore: data.hasMore || false,
        pageSize: data.pageSize || pageSize,
        totalChecked: data.totalChecked || 0,
        totalUnchecked: data.totalUnchecked || 0
      };
      
    } catch (err) {
      console.log("Fetch item tags error:", err);
      return { 
        itemTags: [], 
        totalCount: 0, 
        totalPages: 0, 
        currentPage: 0,
        hasMore: false,
        totalChecked: 0,
        totalUnchecked: 0
      };
    }
  }

  // Update item check status
  async updateItemCheck(itemId, tagNo) {
    try {
      const url = `${this.API_BASE_URL}/itemtag/updateCheck?itemId=${itemId}&tagNo=${tagNo}`;
      const res = await fetch(url, { method: "PUT" });
      const result = await res.json();
      return result;
    } catch (err) {
      console.log("Update item check error:", err);
      return { status: "failed", message: "Something went wrong" };
    }
  }

  // ===================== DROPDOWN DATA METHODS =====================

  async fetchItemNames() {
    try {
      const res = await fetch(`${this.API_BASE_URL}/itemtag/itemnames`);
      const data = await res.json();
      return data || [];
    } catch (err) {
      console.log("Fetch item names error:", err);
      return [];
    }
  }

  async fetchSubItemNames() {
    try {
      const res = await fetch(`${this.API_BASE_URL}/subitemnames`);
      const data = await res.json();
      return data || [];
    } catch (err) {
      console.log("Fetch subitem names error:", err);
      return [];
    }
  }

  async fetchMetalNames() {
    try {
      const res = await fetch(`${this.API_BASE_URL}/metalnames`);
      const data = await res.json();
      return data || [];
    } catch (err) {
      console.log("Fetch metal names error:", err);
      return [];
    }
  }

  async fetchCounterNames() {
    try {
      const res = await fetch(`${this.API_BASE_URL}/itemctrnames`);
      const data = await res.json();
      return data || [];
    } catch (err) {
      console.log("Fetch counter names error:", err);
      return [];
    }
  }

  // Load all dropdown data in parallel
  async loadAllDropdownData() {
    try {
      const [items, subItems, metals, counters] = await Promise.all([
        this.fetchItemNames(),
        this.fetchSubItemNames(),
        this.fetchMetalNames(),
        this.fetchCounterNames()
      ]);

      return {
        items: items || [],
        subItems: subItems || [],
        metals: metals || [],
        counters: counters || []
      };
    } catch (err) {
      console.log("Load dropdown data error:", err);
      return { items: [], subItems: [], metals: [], counters: [] };
    }
  }
}

// Create and export a hook for using the service
export const useItemTagService = () => {
  const API_BASE_URL = useApiBaseUrl();
  return new ItemTagService(API_BASE_URL);
};

// Export the class for direct usage if needed
export default ItemTagService;