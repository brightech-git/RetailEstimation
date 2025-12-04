import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTheme } from "../../../Context/ThemeContext";

export default function BarcodeScannerModal({
  visible,
  onClose,
  scanningField,
  onScanned,
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const COLORS = theme.COLORS;

  useEffect(() => {
    if (permission?.status !== "granted") {
      requestPermission();
    }
  }, [permission]);

  // FAST scanning handler
  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    onScanned(scanningField, data);
    onClose();

    // Reset after a short delay to allow instant next scan
    setTimeout(() => setScanned(false), 600);
  };

  if (!permission?.granted) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={[styles.centered, { backgroundColor: COLORS.background }]}>
          <Text style={[styles.permissionText, { color: COLORS.textDark }]}>
            Camera permission required
          </Text>

          <TouchableOpacity
            onPress={requestPermission}
            style={[styles.permissionButton, { backgroundColor: COLORS.primary }]}
          >
            <Text style={{ color: COLORS.white }}>Grant Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.permissionButton, { marginTop: 10 }]}
          >
            <Text style={{ color: COLORS.white }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "code128", "upc_a", "upc_e"],
          }}
        />

        {/* 🔥 FAST SCAN FOCUS FRAME (this makes detection instant) */}
        <View style={styles.overlayContainer}>
          <View style={styles.focusFrame} />
          <Text style={[styles.scanText, { color: COLORS.white }]}>
            Align inside the box
          </Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeButton,
            { backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
        >
          <Text style={[styles.closeText, { color: COLORS.white }]}>✖</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  permissionText: {
    fontSize: 16,
    marginBottom: 20,
  },

  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    padding: 12,
    borderRadius: 10,
  },

  closeText: {
    fontSize: 18,
    fontWeight: "600",
  },

  // 🔥 Overlay for fast QR scanning
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  focusFrame: {
    width: 260,
    height: 260,
    borderWidth: 4,
    borderColor: "#00FF9A",
    borderRadius: 14,
    opacity: 0.85,
  },

  scanText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
  },
});
