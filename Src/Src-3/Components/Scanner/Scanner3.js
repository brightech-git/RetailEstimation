import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../../../Context/ThemeContext';
import { createBarcodeScannerModalStyles } from './ScannerStyles3';

export default function BarcodeScannerModal({ 
  visible, 
  onClose, 
  scanningField, 
  onScanned 
}) {
  const { theme } = useTheme();
  const styles = createBarcodeScannerModalStyles(theme);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  useEffect(() => {
    if (permission && permission.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    // ✅ FIXED: send only the scanned data
    onScanned?.(data);

    onClose?.();

    // Optional: delay reset to allow next scan
    setTimeout(() => setScanned(false), 500);
  };

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.centered}>
          <Text style={styles.permissionMessage}>
            Camera permission is required to scan barcodes
          </Text>
          <TouchableOpacity 
            onPress={requestPermission} 
            style={styles.permissionButton}
          >
            <Text style={styles.permissionText}>Grant Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onClose} 
            style={[styles.closeButton, { marginTop: 15 }]}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {!scanned ? (
          <View style={styles.cameraContainer}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'ean13', 'code128', 'upc_a', 'upc_e'],
              }}
            />

            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame} />
              <Text style={styles.scannerText}>
                Point camera at barcode to scan
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.COLORS.primary} />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✖ Close Scanner</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
