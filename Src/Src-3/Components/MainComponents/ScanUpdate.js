import React, { useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../Context/ThemeContext";

const ScanUpdateComponent = ({
  mode,
  formData,
  setFormData,
  submitManualData,
  setScannerVisible
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
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
            <Ionicons name="scan" size={34} color={theme.COLORS.buttonText} />
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
                placeholderTextColor={theme.COLORS.placeholder}
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
                placeholderTextColor={theme.COLORS.placeholder}
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

const getStyles = (theme) =>
  StyleSheet.create({
    automaticContainer: {
      alignItems: "center",
      paddingVertical: 10,
      backgroundColor: theme.COLORS.primaryLight,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
    },
    scanButton: {
      padding: 24,
      backgroundColor: theme.COLORS.primary,
      borderRadius: 50,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    scanText: {
      marginTop: 12,
      color: theme.COLORS.primary,
      fontWeight: "600",
      fontSize: 16,
    },
    scanDescription: {
      marginTop: 6,
      color: theme.COLORS.textLight,
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
      color: theme.COLORS.title,
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
      color: theme.COLORS.title,
      marginBottom: 6,
    },
    textInput: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 16,
      color: theme.COLORS.text,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      borderRadius: 8,
      backgroundColor: theme.COLORS.input,
    },
    submitButton: {
      backgroundColor: theme.COLORS.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      elevation: 2,
    },
    submitButtonDisabled: {
      backgroundColor: theme.COLORS.gray,
    },
    submitButtonText: {
      color: theme.COLORS.buttonText,
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
      color: theme.COLORS.primary,
      fontSize: 14,
      fontWeight: "500",
    },
  });

export default ScanUpdateComponent;