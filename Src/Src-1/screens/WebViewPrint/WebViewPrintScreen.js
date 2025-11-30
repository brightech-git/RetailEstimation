import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

const WebViewPrintScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const webViewRef = useRef(null);
  
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
        
        <Text style={styles.title}>Print Estimation</Text>
        
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  printButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  printButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
});

export default WebViewPrintScreen;