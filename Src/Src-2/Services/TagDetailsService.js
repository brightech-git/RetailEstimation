import { useEffect, useState } from "react";
import { useApiBaseUrl } from "../../Config/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useEstimationData = (itemId, tagNo) => {
  const [estimationData, setEstimationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = useApiBaseUrl();

  useEffect(() => {
    if (!itemId || !tagNo) return;

    let isCancelled = false;

    const fetchEstimationData = async () => {
      setLoading(true);
      setError("");
      setEstimationData(null);

      try {
        // Some companies don't use cost centres at all, so this can
        // legitimately be empty - don't block the fetch on it. COSTID is
        // still a required query param on the backend (it resolves the
        // cost centre itself from ITEMID+TAGNO when it's blank), so the
        // key must still be sent.
        const costId = (await AsyncStorage.getItem("SELECTED_COST_ID")) || "";

        const response = await fetch(
          `${API_BASE_URL}/estimationTotal?ITEMID=${itemId}&TAGNO=${tagNo}&COSTID=${encodeURIComponent(
            costId
          )}`
        );
console.log("🔵 Fetching Estimation Data from:", response.url);
        if (!response.ok) {
          throw new Error("Failed to fetch estimation data");
        }

        const data = await response.json();

        if (isCancelled) return;

        if (!data || data?.message === "No record found") {
          setError("No records found for this Tag Key");
          setEstimationData(null);
        } else {
          setEstimationData(Array.isArray(data) ? data[0] : data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchEstimationData();

    return () => {
      isCancelled = true;
    };
  }, [itemId, tagNo, API_BASE_URL]);

  return { estimationData, loading, error };
};

export default useEstimationData;