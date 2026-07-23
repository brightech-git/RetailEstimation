// Phase 5 – Shared Hooks
// Shared camera-scanner logic used by all three sections: handles camera
// permission and a scan-lock so a single scan fires `onScan` only once.
// UI (the CameraView) stays in the component; this hook has none.
import { useState, useCallback } from "react";
import { useCameraPermissions } from "expo-camera";
import { logger } from "@core/logger";

interface UseScannerOptions {
  onScan: (data: string) => void;
}

interface BarcodeResult {
  data: string;
  type?: string;
}

export function useScanner({ onScan }: UseScannerOptions) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = useCallback(
    ({ data }: BarcodeResult) => {
      if (scanned || !data) return; // lock: ignore repeats until reset
      setScanned(true);
      logger.debug("barcode scanned", data);
      onScan(data);
    },
    [scanned, onScan]
  );

  /** Call after handling a scan to allow the next one. */
  const reset = useCallback(() => setScanned(false), []);

  return {
    permission,
    requestPermission,
    granted: permission?.granted ?? false,
    scanned,
    handleBarcodeScanned,
    reset,
  };
}
