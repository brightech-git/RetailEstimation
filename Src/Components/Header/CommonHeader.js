// 📁 Src/Components/Header/CommonHeader.js
// A single reusable screen header — shared across Src-1, Src-2 and Src-3 —
// for any inner screen (Purchase, Print, StockPassword, etc.) that needs a
// simple title bar instead of the big MainHeader (rates card + drawer).
// Usage:
//
//   <CommonHeader
//     title="Purchase"
//     subtitle="3 items added"
//     rightIcon="trash-outline"        // optional — defaults to nothing
//     onRightPress={() => ...}         // required if rightIcon/rightComponent given
//   />
//
// Left icon defaults to a back arrow that calls navigation.goBack(); pass
// leftIcon/onLeftPress to override it, or hideLeftIcon to remove it
// entirely. Right side defaults to empty; pass rightIcon + onRightPress
// for a simple icon button, or rightComponent for anything custom (a
// TouchableOpacity, a badge, two icons, etc.) — rightComponent wins if set.
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../Context/ThemeContext";
import { createCommonHeaderStyles } from "./CommonHeaderStyles";

const CommonHeader = ({
  title,
  subtitle,
  leftIcon = "arrow-back",
  onLeftPress,
  hideLeftIcon = false,
  rightIcon,
  onRightPress,
  rightComponent,
}) => {
  const { theme } = useTheme();
  const styles = createCommonHeaderStyles(theme);
  const navigation = useNavigation();

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
      return;
    }
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  return (
    <LinearGradient
      colors={theme.COLORS.gradientPrimary}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        {/* Left */}
        <View style={styles.sideSlot}>
          {!hideLeftIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLeftPress}
              activeOpacity={0.7}
              testID="header-left-button"
            >
              <Ionicons
                name={leftIcon}
                size={styles.iconSize}
                color={theme.COLORS.buttonText}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Center: title + subtitle */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right — fully controlled by the parent screen */}
        <View style={[styles.sideSlot, styles.rightSlot]}>
          {rightComponent
            ? rightComponent
            : rightIcon && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onRightPress}
                  activeOpacity={0.7}
                  testID="header-right-button"
                >
                  <Ionicons
                    name={rightIcon}
                    size={styles.iconSize}
                    color={theme.COLORS.buttonText}
                  />
                </TouchableOpacity>
              )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default CommonHeader;
