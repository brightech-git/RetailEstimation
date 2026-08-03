/**
 * ImageBitmapProcessor
 *
 * Hidden WebView that renders a full HTML estimation receipt, captures it
 * with html2canvas, converts the canvas to a 1-bit monochrome bitmap, and
 * posts the packed bytes back to React Native.
 *
 * Ported from the RTM POS app's app/utils/ImageBitmapProcessor.tsx, adapted
 * to this project's estimation data shape (see Service/EstimationPrinterService.js
 * fetchEstimationData) and converted from TSX to JS.
 *
 * Flow:
 *   processorRef.current.process(params, printerWidthPx)
 *     → WebView loads an HTML receipt page
 *     → html2canvas renders the receipt div to a canvas
 *     → 1-bit threshold pass (gray < 220 → black dot)
 *     → base64 postMessage → RN decodes to Uint8Array
 *     → caller builds an ESC/POS "GS v 0" raster command and sends it to
 *       the printer over TCP (see printEstimationToPrinterAsImage)
 *
 * Font: every character on the receipt is set in the app's real Trajan Pro
 *       (Src-1/Assets/Fonts/TrajanPro-Regular.ttf + TrajanPro-Bold.otf),
 *       embedded as base64 and loaded via @font-face at weights 400/700 —
 *       no other font is used anywhere on the slip.
 *
 * Layout intentionally mirrors the plain-text ESC/POS receipt this replaces
 * (see printEstimationToPrinter in EstimationPrinterService.js): same
 * fields, same order, same blank fill-in-by-hand lines — just rendered with
 * the real font instead of the printer's built-in one.
 */

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { decode as decodeBase64 } from "base64-arraybuffer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildHtml } from "./buildReceiptHtml";

// ─── Component ──────────────────────────────────────────────────────────────

export const ImageBitmapProcessor = forwardRef((_, ref) => {
  const webviewRef = useRef(null);

  const pendingRef = useRef(null);

  const [source, setSource] = useState({ html: "<html><body></body></html>" });

  useImperativeHandle(ref, () => ({
    async process(params, printerWidthPx = 576) {
      const stored = await AsyncStorage.getItem('COMPANY_DATA');
      const companyData = stored ? JSON.parse(stored) : {};
      const enrichedParams = { ...params, userId: companyData.USERID || null };
      console.log('🖨️ userId for receipt:', enrichedParams.userId, typeof enrichedParams.userId);

      return new Promise((resolve, reject) => {
        if (pendingRef.current) {
          clearTimeout(pendingRef.current.timeoutId);
          pendingRef.current.reject(new Error("Superseded by new print job"));
          pendingRef.current = null;
        }

        // 45s timeout (html2canvas + CDN font/script load)
        const timeoutId = setTimeout(() => {
          if (pendingRef.current) {
            pendingRef.current = null;
            reject(
              new Error(
                "Receipt image processing timed out (45s). Check Wi-Fi connection."
              )
            );
          }
        }, 45000);

        pendingRef.current = { resolve, reject, timeoutId };
        setSource({ html: buildHtml(enrichedParams, printerWidthPx) });
      });
    },
  }));

  const handleMessage = useCallback((event) => {
    const pending = pendingRef.current;
    if (!pending) return;
    clearTimeout(pending.timeoutId);
    pendingRef.current = null;

    try {
      const msg = JSON.parse(event.nativeEvent.data);

      if (!msg.ok) {
        pending.reject(new Error(msg.error || "WebView processing failed"));
        return;
      }

      // Decode on the RN side using base64-arraybuffer — Hermes doesn't
      // reliably provide a global atob() the way a real browser/WebView does.
      const bytes = new Uint8Array(decodeBase64(msg.base64));

      pending.resolve({
        data: bytes,
        widthBytes: msg.widthBytes,
        heightLines: msg.heightLines,
      });
    } catch (e) {
      pending.reject(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  return (
    <View pointerEvents="none" style={styles.hidden}>
      <WebView
        ref={webviewRef}
        source={source}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        mixedContentMode="always"
        allowFileAccess
        style={styles.webview}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  hidden: {
    position: "absolute",
    left: -9999,
    top: -9999,
    width: 1,
    height: 1,
    overflow: "hidden",
    opacity: 0,
  },
  webview: {
    width: 1,
    height: 1,
    opacity: 0,
  },
});

export default ImageBitmapProcessor;
