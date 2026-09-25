import { useCallback, useState } from "react";
import { PurchaseService } from "../Service/PurchaseService";

/**
 * Category + item rows for the Purchase CategorySelectModal, loaded on demand.
 *
 * @param {string} apiBaseUrl
 * @returns {{ data: object[], loading: boolean, error: string, loadCategories: () => Promise<void> }}
 */
const useCategorySearch = (apiBaseUrl) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    if (!apiBaseUrl) return;
    setLoading(true);
    setError("");
    try {
      setData(await new PurchaseService(apiBaseUrl).getCategories());
    } catch (e) {
      console.log("[CategorySelectModal] fetch failed:", e.message);
      setError("Couldn't load categories");
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  return { data, loading, error, loadCategories };
};

export default useCategorySearch;
