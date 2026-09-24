import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../../Context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fontFor, SIZES } from "../../../Utills/Theme";

const WebViewPrintScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const webViewRef = useRef(null);
  const { theme } = useTheme();
  const styles = getStyles(theme.COLORS);
  
  const { htmlContent, slipData } = route.params;

  const handlePrint = () => {
    // Inject JavaScript to trigger browser print
    const printScript = `
      window.print();
      true;
    `;
    
    webViewRef.current?.injectJavaScript(printScript);
  };

  const handleShare = async () => {
    try {
      // You can implement sharing logic here
      Alert.alert(
        "Share Options",
        "To print: Use the browser's print function (Ctrl+P or Cmd+P)\n\nTo save: Use the browser's save as PDF option",
        [
          { text: "OK", onPress: () => {} },
          { text: "Try Print", onPress: handlePrint }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Sharing not available");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          Print Estimation
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
            <Text style={styles.printButtonText}>🖨️ Print</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>📤 Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onLoadEnd={() => {
          console.log('WebView loaded successfully');
        }}
        originWhitelist={['*']}
      />
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceVariant,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: SIZES.fontLg,
    color: COLORS.primary,
    fontFamily: fontFor(),
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: SIZES.h5,
    fontFamily: fontFor('bold'),
    color: COLORS.title,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  printButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  printButtonText: {
    color: COLORS.buttonText,
    fontSize: SIZES.font,
    fontFamily: fontFor('bold'),
  },
  shareButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shareButtonText: {
    color: COLORS.buttonText,
    fontSize: SIZES.font,
    fontFamily: fontFor('bold'),
  },
  webview: {
    flex: 1,
  },
});

export default WebViewPrintScreen;