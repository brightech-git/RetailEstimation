import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LoginContext } from "../../../Context/LoginContext";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import getStyles from "./HeaderStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const MainHeader = () => {
  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [error, setError] = useState(false);
  const [rateUpdated, setRateUpdated] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 🔒 Admin Authentication States (Password only)
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState(false);

  const API_BASE_URL = useApiBaseUrl();
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  // ✅ FIX: Initialize animated value properly
  const slideAnim = useState(new Animated.Value(width))[0];

  const {
    username,
    companyName,
    companyLogo,
    companyLogoUrl,
    logout,
    loading: contextLoading,
  } = useContext(LoginContext);

  const companyLogoFullPath = companyLogoUrl
    ? `${companyLogoUrl.replace(/\/$/, "")}/${encodeURI(
        companyLogo?.replace(/^\//, "") || ""
      )}`
    : null;

  const handleLogout = async () => {
    try {
      // Clear ALL async storage data
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared");

      // Call your existing logout (clears context/login state)
      await logout();

      // Reset navigation
      navigation.replace("Login");
      console.log("Navigation reset to Login screen");
    } catch (error) {
      console.error("Error clearing data:", error);
      Alert.alert("Error", "Something went wrong while logging out.");
    }
  };

  const [currentDateTime] = useState(new Date());
  const date = `${String(currentDateTime.getDate()).padStart(2, "0")}-${String(
    currentDateTime.getMonth() + 1
  ).padStart(2, "0")}-${currentDateTime.getFullYear()}`;

  const fetchRates = async () => {
    setLoadingRates(true);
    setError(false);
    try {
      const response = await fetch(`${API_BASE_URL}/todayrate`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setGoldRate(data.GOLDRATE);
      setSilverRate(data.SILVERRATE);
      setRateUpdated(new Date().toLocaleTimeString("en-GB"));
    } catch {
      setError(true);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerVisible(false));
  };

  // 🔒 Admin Authentication Functions (Password only)
  const handleAdminAuthentication = () => {
    // Hardcoded admin password only
    const HARDCODED_PASSWORD = "admin@123";

    if (adminPassword === HARDCODED_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminAuthError(false);
      setShowAdminAuth(false);
      // Clear password after successful login
      setAdminPassword("");

      // Navigate to Stock Check after authentication
      closeDrawer();
      navigation.navigate("BMGJewellers");
    } else {
      setAdminAuthError(true);
      Alert.alert(
        "Authentication Failed",
        "Invalid password. Please try again.",
        [
          {
            text: "OK",
            onPress: () => {
              setAdminPassword("");
            },
          },
        ]
      );
    }
  };

  const handleStockCheckPress = () => {
    closeDrawer();

    if (isAdminAuthenticated) {
      // If already authenticated, navigate directly
      navigation.navigate("BMGJewellers");
    } else {
      // Show admin authentication modal
      setShowAdminAuth(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    Alert.alert("Admin Logout", "You have been logged out from admin access.");
  };

  if (contextLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
        <Text style={styles.loaderText}>Loading company info...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.COLORS.gradientPrimary}
      style={styles.gradientBackground}
    >
      <View style={styles.scrollContainer}>
        {/* 🔹 HEADER */}
        <View style={styles.topSection}>
          {/* Left: Theme Toggle */}
          <TouchableOpacity style={styles.iconContainer} onPress={toggleTheme}>
            {/* <Ionicons
              name={isDarkMode ? "sunny-outline" : "moon-outline"}
              size={styles.iconSize + 2}
              color={theme.COLORS.warning}
            /> */}
          </TouchableOpacity>

          {/* Center: Company Logo + Name */}
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {companyName || "Company Name"}
            </Text>
          </View>

          {/* Right: Drawer Toggle */}
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={openDrawer}
            testID="menu-button"
          >
            <Ionicons
              name="menu-outline"
              size={styles.iconSize}
              color={theme.COLORS.warning}
            />
          </TouchableOpacity>
        </View>

        {/* 🔹 INFO CARD */}
        <View style={styles.infoCard}>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>📅 Date :</Text>
              <Text style={styles.value}>{date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>🏅 Gold Rate :</Text>
              <Text style={styles.value}>
                ₹{" "}
                {loadingRates
                  ? "Loading..."
                  : error
                  ? "Error"
                  : goldRate?.toLocaleString() ?? "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>👤 User Name :</Text>
              <Text style={styles.value}>{username || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>🥈 Silver Rate :</Text>
              <Text style={styles.value}>
                ₹{" "}
                {loadingRates
                  ? "Loading..."
                  : error
                  ? "Error"
                  : silverRate?.toLocaleString() ?? "N/A"}
              </Text>
            </View>
          </View>

          {rateUpdated && (
            <Text style={styles.updatedText}>
              🕒 Last updated: {rateUpdated}
            </Text>
          )}
        </View>
      </View>

      {/* 🔹 Drawer Overlay */}
      {drawerVisible && (
        <>
          {/* 🔹 Background Overlay */}
          <TouchableOpacity
            style={styles.drawerOverlay}
            activeOpacity={1}
            onPress={closeDrawer}
          />

          {/* 🔹 Sliding Drawer */}
          <Animated.View style={styles.drawerContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.closeDrawer}
                onPress={closeDrawer}
              >
                <Ionicons
                  name="close-outline"
                  size={30}
                  color={theme.COLORS.title}
                />
              </TouchableOpacity>

              <View style={styles.drawerHeader}>
                <Image
                  source={
                    companyLogoFullPath
                      ? { uri: companyLogoFullPath }
                      : require("../../../../assets/brightechlogo.png")
                  }
                  style={styles.drawerLogo}
                  resizeMode="contain"
                />
                <Text style={styles.drawerCompanyName}>
                  {companyName || "Company Name"}
                </Text>
              </View>

              {/* Drawer Items */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  closeDrawer();
                  navigation.navigate("Print");
                }}
              >
                <MaterialIcons
                  name="print"
                  size={26}
                  color={theme.COLORS.iconPrimary}
                />
                <Text style={styles.drawerText}>Print</Text>
              </TouchableOpacity>

              {/* 🔒 Stock Check with Admin Authentication */}
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={handleStockCheckPress}
              >
                <MaterialIcons
                  name="diamond"
                  size={26}
                  color={theme.COLORS.iconPrimary}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={styles.drawerText}>Stock Check</Text>
                  {isAdminAuthenticated && (
                    <View
                      style={{
                        backgroundColor: theme.COLORS.success,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 10,
                        marginLeft: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.COLORS.white,
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        Admin
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  closeDrawer();
                  navigation.navigate("Homescreen1");
                }}
              >
                <Ionicons
                  name="home"
                  size={26}
                  color={theme.COLORS.iconPrimary}
                />
                <Text style={styles.drawerText}>Quick Estimate</Text>
              </TouchableOpacity>

              {/* Admin Logout (only shows when authenticated) */}
              {isAdminAuthenticated && (
                <TouchableOpacity
                  style={[styles.drawerItem, { marginTop: 10 }]}
                  onPress={handleAdminLogout}
                >
                  <MaterialIcons
                    name="admin-panel-settings"
                    size={26}
                    color={theme.COLORS.warning}
                  />
                  <Text
                    style={[styles.drawerText, { color: theme.COLORS.warning }]}
                  >
                    Logout Admin
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  handleLogout();
                }}
              >
                <Ionicons
                  name="log-out-outline"
                  size={26}
                  color={theme.COLORS.danger}
                />
                <Text
                  style={[styles.drawerText, { color: theme.COLORS.danger }]}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </>
      )}

      {/* 🔒 Admin Authentication Modal (Password only) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAdminAuth}
        onRequestClose={() => setShowAdminAuth(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔒 Admin Access Required</Text>
              <Text style={styles.modalSubtitle}>
                Enter admin password to access Stock Check
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Admin Password</Text>
              <TextInput
                style={[styles.textInput, adminAuthError && styles.inputError]}
                placeholder="Enter admin password"
                value={adminPassword}
                onChangeText={setAdminPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor={theme.COLORS.gray}
                onSubmitEditing={handleAdminAuthentication}
              />
            </View>

            {adminAuthError && (
              <Text style={styles.errorText}>
                ❌ Invalid password. Please try again.
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAdminAuth(false);
                  setAdminPassword("");
                  setAdminAuthError(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAdminAuthentication}
              >
                <Text style={styles.submitButtonText}>Authenticate</Text>
              </TouchableOpacity>
            </View>

            {/* Hardcoded password hint (remove in production) */}
            <View style={styles.credentialsHint}>
              <Text style={styles.hintText}>💡 Demo Password: admin@123</Text>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default MainHeader;
