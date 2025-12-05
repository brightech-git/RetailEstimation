// services/ItemTagService.js
import { useApiBaseUrl } from "../../Config/Config";

class ItemTagService {
  constructor(apiBaseUrl) {
    this.API_BASE_URL = apiBaseUrl;
  }

  // ===================== SERVICE METHODS =====================

  // ===================== STATS ONLY METHOD =====================

  async fetchStats(filters = {}) {
    try {
      const url = new URL(`${this.API_BASE_URL}/itemtag/filter`);

      // Add filter parameters
      if (filters.itemId) url.searchParams.append("itemId", filters.itemId);
      if (filters.metalId) url.searchParams.append("metalId", filters.metalId);
      if (filters.subItemId) url.searchParams.append("subItemId", filters.subItemId);
      if (filters.itemCtrId) url.searchParams.append("itemCtrId", filters.itemCtrId);
      if (filters.checked) url.searchParams.append("checked", filters.checked);

      const res = await fetch(url.toString());
      const data = await res.json();
      console.log("Filter API", url.toString());
      console.log("Filter API Response", data);

      return {
        totalCount: data.totalCount || 0,
        totalChecked: data.totalChecked || 0,
        totalUnchecked: data.totalUnchecked || 0
      };

    } catch (err) {
      console.log("Fetch stats error:", err);
      return {
        totalCount: 0,
        totalChecked: 0,
        totalUnchecked: 0
      };
    }
  }

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

  // Update item check status - UPDATED TO MATCH YOUR API
  async updateItemCheck(itemId, tagNo, subItemId, metalId, itemCtrId) {
    try {
      // Get metal name from metalId (assuming you have a way to map this)
      // For now, I'll pass metalId directly as metalName if needed
      const metalName = metalId; // You may need to fetch metal name from dropdownData
      
      // Build URL with all required parameters
      const url = new URL(`${this.API_BASE_URL}/itemtag/updateCheck`);
      
      // Add all required query parameters
      url.searchParams.append("itemId", itemId);
      url.searchParams.append("tagNo", tagNo);
      url.searchParams.append("subItemId", subItemId);
      url.searchParams.append("metalName", metalId); // Using metalId as metalName
      url.searchParams.append("itemCtrId", itemCtrId);
      
      console.log("Update API URL:", url.toString());
      
      const res = await fetch(url, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await res.json();
      console.log("Update response:", result);
      return result;
    } catch (err) {
      console.log("Update item check error:", err);
      return { status: "failed", message: "Something went wrong" };
    }
  }

  // Alternative version if you need to map metalId to metalName
  async updateItemCheckWithMetalMapping(itemId, tagNo, subItemId, metalId, itemCtrId, dropdownData = null) {
    try {
      let metalName = metalId;
      
      // If dropdownData is provided, try to find metal name
      if (dropdownData && dropdownData.metals && Array.isArray(dropdownData.metals)) {
        const metal = dropdownData.metals.find(m => 
          m.id === parseInt(metalId) || m.value === metalId || m.id?.toString() === metalId
        );
        if (metal) {
          metalName = metal.name || metal.label || metal.value || metalId;
        }
      }
      
      // Build URL with all required parameters
      const url = new URL(`${this.API_BASE_URL}/itemtag/updateCheck`);
      
      // Add all required query parameters
      url.searchParams.append("itemId", itemId);
      url.searchParams.append("tagNo", tagNo);
      url.searchParams.append("subItemId", subItemId);
      url.searchParams.append("metalName", metalName);
      url.searchParams.append("itemCtrId", itemCtrId);
      
      console.log("Update API URL with metal mapping:", url.toString());
      
      const res = await fetch(url, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await res.json();
      console.log("Update response:", result);
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