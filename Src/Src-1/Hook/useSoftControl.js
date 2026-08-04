import { useState, useEffect, useCallback } from "react";
import { SoftControlService } from "../Service/SoftControlService";

/**
 * Fetches soft controls for the given costId.
 *
 * @param {string} apiBaseUrl
 * @param {string} costId
 * @returns {{
 *   controls: import("../types/SoftControl").SoftControl[],
 *   loading: boolean,
 *   error: string|null,
 *   getControlValue: (ctlId: string) => string,
 *   refresh: () => void,
 * }}
 */
const useSoftControl = (apiBaseUrl, costId) => {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchControls = useCallback(async () => {
    if (!apiBaseUrl || !costId) return;
    setLoading(true);
    setError(null);
    try {
      const service = new SoftControlService(apiBaseUrl);
      const data = await service.getSoftControls(costId);
      setControls(data);
    } catch (err) {
      setError(err.message || "Failed to fetch soft controls");
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, costId]);

  useEffect(() => {
    fetchControls();
  }, [fetchControls]);

  const getControlValue = useCallback(
    (ctlId) => controls.find((c) => c.ctlId === ctlId)?.ctlText || "",
    [controls]
  );

  return { controls, loading, error, getControlValue, refresh: fetchControls };
};

export default useSoftControl;
