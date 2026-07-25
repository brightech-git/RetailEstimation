// 📁 Src/Components/Sidebar/Sidebar.js
// Reusable drawer content for @react-navigation/drawer.
// Renders the app logo, a light/dark theme switch, the main navigation
// items (shared across the Src-1 / Src-2 / Src-3 flows) and logout.
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import {
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../Context/ThemeContext";
import { LoginContext } from "../../Context/LoginContext";
import getStyles from "./SidebarStyles";

const Sidebar = (props) => {
  const { navigation, state } = props;
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  // Resolve the active screen name from the nested stack inside AppScreens
  const innerState = state?.routes?.find((r) => r.name === "AppScreens")?.state;
  const activeRouteName = innerState
    ? innerState.routeNames?.[innerState.index]
    : state?.routeNames?.[state.index];

  const {
    username,
    companyName,
    companyLogo,
    companyLogoUrl,
    logout,
    contactNumber,
    stockPassword,
  } = useContext(LoginContext);

  const companyLogoFullPath = companyLogoUrl
    ? `${companyLogoUrl.replace(/\/$/, "")}/${encodeURI(
        companyLogo?.replace(/^\//, "") || "",
      )}`
    : null;

  // 🔒 Admin (Stock Check) authentication
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState(false);

  // 🔒 Change stock password authentication
  const [showChangePasswordAuth, setShowChangePasswordAuth] = useState(false);
  const [contactNumberInput, setContactNumberInput] = useState("");
  const [changePasswordAuthError, setChangePasswordAuthError] = useState(false);

  const closeDrawer = () => navigation.closeDrawer();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await logout();
      closeDrawer();
    } catch (error) {
      console.error("Error clearing data:", error);
      Alert.alert("Error", "Something went wrong while logging out.");
    }
  };

  const handleAdminAuthentication = () => {
    if (stockPassword && adminPassword === stockPassword) {
      setIsAdminAuthenticated(true);
      setAdminAuthError(false);
      setShowAdminAuth(false);
      setAdminPassword("");
      closeDrawer();
      navigation.navigate("AppScreens", { screen: "BMGJewellers" });
    } else {
      setAdminAuthError(true);
      Alert.alert("Authentication Failed", "Invalid password. Please try again.", [
        { text: "OK", onPress: () => setAdminPassword("") },
      ]);
    }
  };

  const handleContactNumberVerification = () => {
    if (contactNumberInput === contactNumber) {
      setChangePasswordAuthError(false);
      setShowChangePasswordAuth(false);
      setContactNumberInput("");
      closeDrawer();
      navigation.navigate("AppScreens", { screen: "ChangeStockPassword" });
    } else {
      setChangePasswordAuthError(true);
      Alert.alert(
        "Verification Failed",
        "Contact number does not match. Please try again.",
        [{ text: "OK", onPress: () => setContactNumberInput("") }],
      );
    }
  };

  const handleStockCheckPress = () => {
    if (!stockPassword) {
      Alert.alert(
        "Access Restricted",
        "Stock password is not configured. Please contact administrator.",
        [{ text: "OK" }],
      );
      return;
    }
    if (isAdminAuthenticated) {
      closeDrawer();
      navigation.navigate("AppScreens", { screen: "BMGJewellers" });
    } else {
      setShowAdminAuth(true);
    }
  };

  const handleChangePasswordPress = () => {
    if (!contactNumber) {
      Alert.alert(
        "Information Missing",
        "Contact number is not available. Please contact administrator.",
        [{ text: "OK" }],
      );
      return;
    }
    setShowChangePasswordAuth(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    Alert.alert("Admin Logout", "You have been logged out from admin access.");
  };

  const NavItem = ({ icon, iconSet: IconSet = MaterialIcons, label, routeName, onPress, badge, danger }) => {
    const focused = routeName && activeRouteName === routeName;
    return (
      <TouchableOpacity
        style={[styles.drawerItem, focused && styles.drawerItemActive]}
        onPress={onPress}
      >
        <IconSet
          name={icon}
          size={24}
          color={danger ? theme.COLORS.danger : focused ? theme.COLORS.buttonText : theme.COLORS.iconPrimary}
        />
        <View style={styles.drawerItemLabelRow}>
          <Text
            style={[
              styles.drawerText,
              danger && { color: theme.COLORS.danger },
              focused && styles.drawerTextActive,
            ]}
          >
            {label}
          </Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Header: Logo + company */}
        <View style={styles.drawerHeader}>
          <Image
            source={
              companyLogoFullPath
                ? { uri: companyLogoFullPath }
                : require("../../../assets/brightechlogo.png")
            }
            style={styles.drawerLogo}
            resizeMode="cover"
          />
          <Text style={styles.drawerCompanyName}>{companyName || "Company Name"}</Text>
          {!!username && <Text style={styles.drawerUsername}>👤 {username}</Text>}
        </View>

        {/* Theme toggle */}
        <View style={styles.themeRow}>
          <View style={styles.drawerItemLabelRow}>
            <Ionicons
              name={isDarkMode ? "moon" : "sunny"}
              size={22}
              color={theme.COLORS.iconPrimary}
            />
            <Text style={styles.drawerText}>{isDarkMode ? "Dark Mode" : "Light Mode"}</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.COLORS.outline, true: theme.COLORS.primaryLight }}
            thumbColor={isDarkMode ? theme.COLORS.primary : theme.COLORS.surface}
          />
        </View>

        <View style={styles.divider} />

        {/* Navigation items */}
        <NavItem
          icon="home"
          iconSet={Ionicons}
          label="Home"
          routeName="Home"
          onPress={() => {
            closeDrawer();
            navigation.navigate("AppScreens", { screen: "Home" });
          }}
        />

        <NavItem
          icon="home"
          iconSet={Ionicons}
          label="Quick Estimate"
          routeName="Homescreen1"
          onPress={() => {
            closeDrawer();
            navigation.navigate("AppScreens", { screen: "Homescreen1" });
          }}
        />

        <NavItem
          icon="print"
          label="Print"
          routeName="Print"
          onPress={() => {
            closeDrawer();
            navigation.navigate("AppScreens", { screen: "Print" });
          }}
        />

        <NavItem
          icon="diamond"
          label="Stock Check"
          routeName="BMGJewellers"
          badge={isAdminAuthenticated ? "Admin" : null}
          onPress={handleStockCheckPress}
        />

        <NavItem
          icon="lock-reset"
          label="Change Stock Password"
          routeName="ChangeStockPassword"
          onPress={handleChangePasswordPress}
        />

        {isAdminAuthenticated && (
          <NavItem
            icon="admin-panel-settings"
            label="Logout Admin"
            onPress={handleAdminLogout}
          />
        )}

        <View style={styles.divider} />

        <NavItem
          icon="log-out-outline"
          iconSet={Ionicons}
          label="Logout"
          danger
          onPress={handleLogout}
        />
      </DrawerContentScrollView>

      {/* 🔒 Admin Authentication Modal */}
      <Modal
        animationType="slide"
        transparent
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
                placeholderTextColor={theme.COLORS.placeholder}
                onSubmitEditing={handleAdminAuthentication}
              />
            </View>

            {adminAuthError && (
              <Text style={styles.errorText}>❌ Invalid password. Please try again.</Text>
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
          </View>
        </View>
      </Modal>

      {/* 🔒 Contact Number Verification Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showChangePasswordAuth}
        onRequestClose={() => setShowChangePasswordAuth(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📞 Contact Verification</Text>
              <Text style={styles.modalSubtitle}>
                Enter your registered contact number to change stock password
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              <TextInput
                style={[styles.textInput, changePasswordAuthError && styles.inputError]}
                placeholder="Enter contact number"
                value={contactNumberInput}
                onChangeText={setContactNumberInput}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholderTextColor={theme.COLORS.placeholder}
                onSubmitEditing={handleContactNumberVerification}
              />
            </View>

            {changePasswordAuthError && (
              <Text style={styles.errorText}>
                ❌ Contact number does not match. Please try again.
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowChangePasswordAuth(false);
                  setContactNumberInput("");
                  setChangePasswordAuthError(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleContactNumberVerification}
              >
                <Text style={styles.submitButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Sidebar;
