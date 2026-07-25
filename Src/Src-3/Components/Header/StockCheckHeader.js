// 📁 Src/Src-3/Components/Header/StockCheckHeader.js
// Dedicated header for the "Stock Check" (Src-3 Home / BMGJewellers)
// screen. Kept separate from the generic CommonHeader so this page's
// header (title, back button, sidebar launcher) can evolve on its own.
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../Context/ThemeContext";
import getStyles from "./StockCheckHeaderStyles";

const StockCheckHeader = ({ title = "Stock Checker", onBackPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={theme.COLORS.gradientPrimary}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress || (() => navigation.goBack())}
          testID="back-button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.COLORS.buttonText} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.openDrawer()}
          testID="menu-button"
        >
          <Ionicons name="menu-outline" size={26} color={theme.COLORS.buttonText} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default StockCheckHeader;
