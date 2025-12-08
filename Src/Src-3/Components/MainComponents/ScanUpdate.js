import React, { useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ScanUpdateComponent = ({ 
  mode, 
  formData, 
  setFormData, 
  submitManualData, 
  setScannerVisible 
}) => {
  const tagNoRef = useRef(null);

  return (
    <View>
      {/* Automatic Scan */}
      {mode === "automatic" && (
        <View style={styles.automaticContainer}>
          <TouchableOpacity 
            onPress={() => setScannerVisible(true)} 
            style={styles.scanButton}
            activeOpacity={0.8}
          >
            <Ionicons name="scan" size={34} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.scanText}>Scan Now</Text>
          <Text style={styles.scanDescription}>
            Scan QR code to automatically update item
          </Text>
        </View>
      )}

      {/* Manual Input */}
      {mode === "manual" && (
        <View style={styles.manualContainer}>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ITEM ID:</Text>
              <TextInput
                style={styles.textInput}
                value={formData.itemId}
                onChangeText={(text) => setFormData({ ...formData, itemId: text })}
                placeholder="Enter Item ID"
                placeholderTextColor="#999"
                returnKeyType="next"
                onSubmitEditing={() => tagNoRef.current?.focus()}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>TAG NO:</Text>
              <TextInput
                ref={tagNoRef}
                style={styles.textInput}
                value={formData.tagNo}
                onChangeText={(text) => setFormData({ ...formData, tagNo: text })}
                placeholder="Enter Tag No"
                placeholderTextColor="#999"
                returnKeyType="done"
                onSubmitEditing={submitManualData}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          {/* Submit Button for Manual Mode */}
          <TouchableOpacity 
            style={[styles.submitButton, (!formData.itemId || !formData.tagNo) && styles.submitButtonDisabled]} 
            onPress={submitManualData}
            activeOpacity={0.8}
            disabled={!formData.itemId || !formData.tagNo}
          >
            <Text style={styles.submitButtonText}>
              UPDATE ITEM
            </Text>
          </TouchableOpacity>  
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  automaticContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f8fbff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6f0ff",
  },
  scanButton: {
    padding: 24,
    backgroundColor: "#1C467C",
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scanText: {
    marginTop: 12,
    color: "#1C467C",
    fontWeight: "600",
    fontSize: 16,
  },
  scanDescription: {
    marginTop: 6,
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  manualContainer: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  submitButton: {
    backgroundColor: "#1C467C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  scanAlternativeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    padding: 8,
  },
  scanIcon: {
    marginRight: 6,
  },
  scanAlternativeText: {
    color: "#1C467C",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ScanUpdateComponent;