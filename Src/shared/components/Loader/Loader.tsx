// Phase 4 – Shared Components
// Reusable loading indicator. Inline by default; set fullScreen to center it.
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { LoaderProps } from "./types";

const styles = makeStyles(theme);

export const Loader: React.FC<LoaderProps> = ({
  size = "large",
  color = theme.colors.primary,
  fullScreen = false,
  label,
  style,
}) => {
  return (
    <View style={[fullScreen ? styles.fullScreen : styles.inline, style]}>
      <ActivityIndicator size={size} color={color} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

export default Loader;
