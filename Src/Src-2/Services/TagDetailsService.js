import { useEffect, useState } from "react";
import { useApiBaseUrl } from "../../Config/Config";
import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

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
        const api = createApiInstance(API_BASE_URL);
        const response = await api.get(ENDPOINTS.ESTIMATION_TOTAL, {
          params: { ITEMID: itemId, TAGNO: tagNo },
        });
        console.log("🔵 Fetching Estimation Data from:", response.config?.url);

        if (isCancelled) return;

        const data = response.data;
        if (!data || data?.message === "No record found") {
          setError("No records found for this Tag Key");
          setEstimationData(null);
        } else {
          setEstimationData(Array.isArray(data) ? data[0] : data);
        }
      } catch (err) {
        if (!isCancelled) setError(err.message || "Something went wrong");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchEstimationData();
    return () => { isCancelled = true; };
  }, [itemId, tagNo, API_BASE_URL]);

  return { estimationData, loading, error };
};

export default useEstimationData;
