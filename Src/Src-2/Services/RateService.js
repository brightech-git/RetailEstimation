import { useEffect, useState } from "react";
import { useApiBaseUrl } from "../../Config/Config";
import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

const useServiceRates = () => {
  const [rates, setRates] = useState({ SILVERRATE: 0, GOLDRATE: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = useApiBaseUrl();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const api = createApiInstance(API_BASE_URL);
        const response = await api.get(ENDPOINTS.TODAY_RATE);
        const data = response.data;
        setRates({ SILVERRATE: data.SILVERRATE, GOLDRATE: data.GOLDRATE });
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, loading, error };
};

export default useServiceRates;
