// EstimationPrintPreview.js
import React, { useRef } from "react";
import { View, Button } from "react-native";
import { WebView } from "react-native-webview";
import { buildEstimationHTML } from "./EstimationPrinterServiceHtml";

export default function EstimationPrintPreview({ slipData }) {
  const webRef = useRef(null);
  const html = buildEstimationHTML(slipData, { paper: "80mm", theme: "gold" });

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1 }}
      />
      <Button
        title="Print (open native print)"
        onPress={() => {
          // For Android WebView, you can inject window.print() js:
          webRef.current.injectJavaScript("window.print(); true;");
        }}
      />
    </View>
  );
}
