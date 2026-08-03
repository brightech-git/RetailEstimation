import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LoginContext } from "../../../Context/LoginContext";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import getStyles from "./HeaderStyles";

const { width } = Dimensions.get("window");

// MainHeader renders the top bar (theme toggle, company name, sidebar
// launcher) and the gold/silver rate info card. The sidebar itself (menu
// items, admin auth, logout, etc.) lives in Src/Components/Sidebar and is
// opened via the drawer navigator's own openDrawer() action.
const MainHeader = () => {
  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [error, setError] = useState(false);
  const [rateUpdated, setRateUpdated] = useState(null);

  const API_BASE_URL = useApiBaseUrl();
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const {
    username,
    companyName,
    selectedCostId,
    loading: contextLoading,
  } = useContext(LoginContext);

  const [currentDateTime] = useState(new Date());
  const date = `${String(currentDateTime.getDate()).padStart(2, "0")}-${String(
    currentDateTime.getMonth() + 1,
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
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleTheme}
            testID="theme-toggle-button"
          >
            <Ionicons
              name={isDarkMode ? "sunny-outline" : "moon-outline"}
              size={styles.iconSize}
              color={theme.COLORS.warning}
            />
          </TouchableOpacity>

          {/* Center: Company Logo + Name */}
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {companyName || "Company Name"}
            </Text>
          </View>

          {/* Right: Sidebar Toggle */}
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.openDrawer()}
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
            {/* Left Column */}
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>📅 Date :</Text>
                <Text style={styles.value}>{date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>👤 User :</Text>
                <Text style={styles.value} numberOfLines={1}>{username || "N/A"}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.label}>💰 Cost ID :</Text>
                <Text style={styles.value}>{selectedCostId || "N/A"}</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.columnDivider} /> 

            {/* Right Column */}
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>🏅 Gold :</Text>
                <Text style={styles.value}>
                  ₹ {loadingRates ? "..." : error ? "Err" : (goldRate?.toLocaleString() ?? "N/A")}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>🥈 Silver :</Text>
                <Text style={styles.value}>
                  ₹ {loadingRates ? "..." : error ? "Err" : (silverRate?.toLocaleString() ?? "N/A")}
                </Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.label}>🕒 Updated :</Text>
                <Text style={styles.value} numberOfLines={1}>{rateUpdated || "--"}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default MainHeader;