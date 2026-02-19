// services/ItemTagService.js
import { useApiBaseUrl } from "../../Config/Config";

class ItemTagService {
  constructor(apiBaseUrl) {
    this.API_BASE_URL = apiBaseUrl;
  }

  // ===================== SERVICE METHODS =====================

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

      // Add pagination parameters
      url.searchParams.append("page", page);
      url.searchParams.append("pageSize", pageSize);

      // Add filter parameters - only add if they exist
      if (filters.itemId) url.searchParams.append("itemId", filters.itemId);
      if (filters.metalId) url.searchParams.append("metalId", filters.metalId);
      if (filters.subItemId) url.searchParams.append("subItemId", filters.subItemId);
      if (filters.itemCtrId) url.searchParams.append("itemCtrId", filters.itemCtrId);

      const res = await fetch(url.toString());
      const data = await res.json();
      
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
  async updateItemCheck(itemId, tagNo, subItemId, metalId, itemCtrId) {
    try {
      const url = new URL(`${this.API_BASE_URL}/itemtag/updateCheck`);
      
      url.searchParams.append("itemId", itemId);
      url.searchParams.append("tagNo", tagNo);
      url.searchParams.append("subItemId", subItemId);
      url.searchParams.append("metalName", metalId);
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

  // ===================== DROPDOWN DATA METHODS =====================

  // Fetch metal names
  async fetchMetalNames() {
    try {
      const res = await fetch(`${this.API_BASE_URL}/metalnames`);
      const data = await res.json();
      console.log("Fetched metal names:", data);
      return data || [];
    } catch (err) {
      console.log("Fetch metal names error:", err);
      return [];
    }
  }

  // Fetch counter names
  async fetchCounterNames() {
    try {
      const res = await fetch(`${this.API_BASE_URL}/itemctrnames`);
      const data = await res.json();
      console.log("Fetched counter names:", data?.length || 0);
      return data || [];
    } catch (err) {
      console.log("Fetch counter names error:", err);
      return [];
    }
  }

  /**
   * Fetch items based on metalId
   * Using the correct parameter: metalId (not metall)
   */
  async fetchItemsByMetal(metalId) {
    try {
      if (!metalId) return [];

      const url = new URL(`${this.API_BASE_URL}/itemtag/itemnames-with-subitems`);
      
      // Use metalId parameter as shown in your API example
      url.searchParams.append("metalId", metalId);

      console.log("Fetching items by metal:", url.toString());
      
      const res = await fetch(url.toString());
      const data = await res.json();
      
      console.log(`Fetched ${Array.isArray(data) ? data.length : 1} items for metal ${metalId}`);
      
      // Handle the API response
      if (Array.isArray(data)) {
        // Map to consistent format
        return data.map(item => ({
          id: item.item_id || item.id,
          name: item.item_name || item.name,
          subitems: item.subitems || []
        }));
      } else if (data && typeof data === 'object') {
        // If it's a single object, wrap it in an array
        return [{
          id: data.item_id || data.id,
          name: data.item_name || data.name,
          subitems: data.subitems || []
        }];
      }
      
      return [];

    } catch (err) {
      console.log("Fetch items by metal error:", err);
      return [];
    }
  }

  /**
   * Fetch subitems for a specific item and metal
   */
  async fetchSubItems(itemId, metalId) {
    try {
      if (!itemId || !metalId) return [];

      const url = new URL(`${this.API_BASE_URL}/itemtag/itemnames-with-subitems`);
      
      url.searchParams.append("itemId", itemId);
      url.searchParams.append("metalId", metalId);

      console.log("Fetching subitems:", url.toString());
      
      const res = await fetch(url.toString());
      const data = await res.json();
      
      console.log(`Fetched subitems for item ${itemId}`);
      
      // Handle array response
      if (Array.isArray(data)) {
        // Find the matching item and return its subitems
        const matchingItem = data.find(item => 
          item.item_id?.toString() === itemId?.toString() || 
          item.id?.toString() === itemId?.toString()
        );
        return matchingItem?.subitems || [];
      } 
      // Handle single object response
      else if (data && data.subitems) {
        return data.subitems;
      }
      
      return [];

    } catch (err) {
      console.log("Fetch subitems error:", err);
      return [];
    }
  }

  /**
   * Load all dropdown data - metals and counters first
   */
  async loadAllDropdownData() {
    try {
      const [metals, counters] = await Promise.all([
        this.fetchMetalNames(),
        this.fetchCounterNames()
      ]);

      return {
        items: [], // Will be populated when metal is selected
        subItems: [], // Will be populated when item is selected
        metals: metals || [],
        counters: counters || []
      };
    } catch (err) {
      console.log("Load dropdown data error:", err);
      return { 
        items: [], 
        subItems: [], 
        metals: [], 
        counters: [] 
      };
    }
  }
}

// Create and export a hook for using the service
export const useItemTagService = () => {
  const API_BASE_URL = useApiBaseUrl();
  return new ItemTagService(API_BASE_URL);
};

export default ItemTagService;