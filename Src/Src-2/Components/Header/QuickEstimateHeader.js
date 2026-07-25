// 📁 Src/Src-2/Components/Header/QuickEstimateHeader.js
// Dedicated header for the "Quick Estimate" (Src-2 Home) screen. Kept
// separate from the main Src-1 Home header and the Src-3 Stock Check
// header so each page's header can evolve independently.
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../Context/ThemeContext";
import { LoginContext } from "../../../Context/LoginContext";
import { createQuickEstimateHeaderStyles } from "./QuickEstimateHeaderStyles";

const QuickEstimateHeader = () => {
  const { theme } = useTheme();
  const styles = createQuickEstimateHeaderStyles(theme);
  const navigation = useNavigation();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const {
    companyName,
    companyLogo,
    companyLogoUrl,
  } = useContext(LoginContext);

  const companyLogoFullPath = companyLogoUrl
    ? `${companyLogoUrl.replace(/\/$/, "")}/${encodeURI(
        companyLogo?.replace(/^\//, "") || ""
      )}`
    : null;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day = String(currentDateTime.getDate()).padStart(2, "0");
  const month = String(currentDateTime.getMonth() + 1).padStart(2, "0");
  const year = currentDateTime.getFullYear();
  const date = `${day}-${month}-${year}`;
  const time = currentDateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <LinearGradient
      colors={theme.COLORS.gradientPrimary}
      style={styles.gradientBackground}
    >
      <Animated.View
        style={[
          styles.headerContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Sidebar launcher */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
          testID="menu-button"
        >
          <Ionicons name="menu-outline" size={26} color={theme.COLORS.buttonText} />
        </TouchableOpacity>

        <View style={styles.companySection}>
          <Image
            source={
              companyLogoFullPath
                ? { uri: companyLogoFullPath }
                : require("../../../../assets/brightechlogo.png")
            }
            style={styles.companyLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.companyName}>{companyName}</Text>
            {/* <Text style={styles.pageTitle}>Quick Estimate</Text> */}
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.dateTimeContainer}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>📅 DATE :</Text>
              <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>🕒 TIME :</Text>
              <Text style={styles.dateText}>{time}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default QuickEstimateHeader;
