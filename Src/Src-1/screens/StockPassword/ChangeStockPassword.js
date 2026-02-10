// screens/ChangeStockPassword.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../Context/ThemeContext";
import { LoginContext } from "../../../Context/LoginContext";
import { updateCompanyStockPassword } from "../../Service/StockPasswordUpdateService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const ChangeStockPassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { companyId, stockPassword: contextStockPassword } = useContext(LoginContext);

  // Get company ID from context or use default
  const COMPANY_ID = companyId || 4;

  // Verify user is still authenticated

  const handleSubmit = async () => {
    // Reset messages
    setMessage("");
    setError("");

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Verify current password matches
    if (currentPassword !== contextStockPassword) {
      setError("Current password is incorrect");
      return;
    }

    // Check if new password matches confirmation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    // Check password length
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await updateCompanyStockPassword({
        stockPassword: newPassword,
        id: COMPANY_ID,
      });

      // Success
      setMessage("Stock password updated successfully! ✅");
      
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Show success alert
      Alert.alert(
        "Success",
        "Stock password has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={theme.COLORS.gradientPrimary}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.COLORS.title} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Stock Password</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>
              Update the stock password for your company
            </Text>

            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Stock Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter current stock password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                  placeholderTextColor={theme.COLORS.gray}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? "eye-off" : "eye"}
                    size={24}
                    color={theme.COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Stock Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new stock password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholderTextColor={theme.COLORS.gray}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={24}
                    color={theme.COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm new stock password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={theme.COLORS.gray}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color={theme.COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirement}>• Must be at least 6 characters long</Text>
              <Text style={styles.requirement}>• Remember this password for stock access</Text>
              <Text style={styles.requirement}>• Keep it secure and don't share</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>

            {/* Messages */}
            {message ? (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={24} color={theme.COLORS.success} />
                <Text style={styles.successText}>{message}</Text>
              </View>
            ) : null}

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color={theme.COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardAvoid: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    backButton: {
      marginRight: 15,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.COLORS.title,
    },
    card: {
      backgroundColor: theme.COLORS.card,
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    subtitle: {
      fontSize: 16,
      color: theme.COLORS.text,
      marginBottom: 25,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.COLORS.text,
      marginBottom: 8,
    },
    passwordInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      borderRadius: 8,
      backgroundColor: theme.COLORS.inputBackground,
    },
    textInput: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: theme.COLORS.text,
    },
    eyeButton: {
      padding: 10,
    },
    requirementsContainer: {
      backgroundColor: theme.COLORS.infoLight,
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
    },
    requirementsTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.COLORS.info,
      marginBottom: 8,
    },
    requirement: {
      fontSize: 12,
      color: theme.COLORS.text,
      marginBottom: 4,
    },
    submitButton: {
      backgroundColor: theme.COLORS.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 20,
    },
    disabledButton: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: theme.COLORS.white,
      fontSize: 16,
      fontWeight: "bold",
    },
    successContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.COLORS.successLight,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    successText: {
      color: theme.COLORS.success,
      marginLeft: 10,
      flex: 1,
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.COLORS.dangerLight,
      padding: 15,
      borderRadius: 8,
    },
    errorText: {
      color: theme.COLORS.danger,
      marginLeft: 10,
      flex: 1,
    },
  });

export default ChangeStockPassword;