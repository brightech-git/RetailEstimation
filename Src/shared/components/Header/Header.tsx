// Phase 4 – Shared Components
// Simple app bar: centered title/subtitle with optional back button and one
// right action. UI only — the caller supplies onBack/onRightPress (no
// navigation or business logic inside).
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { HeaderProps } from "./types";

const styles = makeStyles(theme);

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.side}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name={rightIcon} size={22} color={theme.colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
