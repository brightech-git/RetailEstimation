import { useCallback, useEffect, useState } from "react";
import { RateService } from "../Service/RateService";

/**
 * Today's gold/silver rates, refreshed every `refreshMs` (default 60s).
 *
 * @param {string} apiBaseUrl
 * @param {number} [refreshMs]
 * @returns {{ goldRate, silverRate, loading: boolean, error: boolean, updatedAt: string|null, refresh: () => void }}
 */
const useTodayRate = (apiBaseUrl, refreshMs = 60000) => {
  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const refresh = useCallback(async () => {
    if (!apiBaseUrl) return;
    setLoading(true);
    setError(false);
    try {
      const data = await new RateService(apiBaseUrl).getTodayRate();
      setGoldRate(data.GOLDRATE);
      setSilverRate(data.SILVERRATE);
      setUpdatedAt(new Date().toLocaleTimeString("en-GB"));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshMs);
    return () => clearInterval(interval);
  }, [refresh, refreshMs]);

  return { goldRate, silverRate, loading, error, updatedAt, refresh };
};

export default useTodayRate;
