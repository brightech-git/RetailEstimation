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
import useTodayRate from "../../Hook/useTodayRate";


// MainHeader renders the top bar (theme toggle, company name, sidebar
// launcher) and the gold/silver rate info card. The sidebar itself (menu
// items, admin auth, logout, etc.) lives in Src/Components/Sidebar and is
// opened via the drawer navigator's own openDrawer() action.
const MainHeader = () => {

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

  const {
    goldRate,
    silverRate,
    loading: loadingRates,
    error,
    updatedAt: rateUpdated,
  } = useTodayRate(API_BASE_URL);

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
            <Text
              style={styles.companyName}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
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
                <Text style={styles.label} numberOfLines={1}>📅 Date :</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>{date}</Text>
              </View>
              <View
                style={[
                  styles.infoRow,
                  !selectedCostId && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.label} numberOfLines={1}>👤 User :</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>{username || "N/A"}</Text>
              </View>
              {selectedCostId ? (
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.label} numberOfLines={1}>💰 Cost ID :</Text>
                  <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>{selectedCostId}</Text>
                </View>
              ) : null}
            </View>

            {/* Divider */}
            <View style={styles.columnDivider} /> 

            {/* Right Column */}
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.label} numberOfLines={1}>🏅 Gold :</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                  ₹ {loadingRates ? "..." : error ? "Err" : (goldRate?.toLocaleString() ?? "N/A")}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label} numberOfLines={1}>🥈 Silver :</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                  ₹ {loadingRates ? "..." : error ? "Err" : (silverRate?.toLocaleString() ?? "N/A")}
                </Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.label} numberOfLines={1}>🕒 Updated :</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>{rateUpdated || "--"}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default MainHeader;